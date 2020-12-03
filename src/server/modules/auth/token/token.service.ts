import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { REDIS_CLIENT } from '../../../di.symbols'
import { RedisClient } from '../../../types'
import { ConfigService } from '@nestjs/config'
import { isArray } from '../../../../common/type-guards'
import Omit = jest.Omit
import { convertSimpleExpiresToSeconds } from '../../../common/date'
import { IUser } from '../../../../common/forum/forum.interfaces'
import { JwtStrategyValidatePayload } from '../types'


const KEY_PREFIX = 'refresh-token'
const REDIS_LAST_TIME_KEY = (userId: number, fingerprintLight: string) => `jwt-gen-last.${userId}.${fingerprintLight}`

const parseKeyRule = new RegExp(`/${KEY_PREFIX}.(\n+).(\w+).(\d+)/`)

interface FullInfo {
  key: string
  time: number
  userId: number
  fingerprintLight: string
  token: string
}

type ParsedInfo = Omit<FullInfo, 'token'>

@Injectable()
export class TokenService {

  constructor (
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
  ) {
  }

  private key (userId: number, fingerprintLight: string | '*' = '*', time: number | '*' = '*') {
    return `${KEY_PREFIX}.${userId}.${fingerprintLight}.${time}`
  }

  private parseKey(key: string): ParsedInfo | undefined  {
    const match = parseKeyRule.exec(key)

    if (match?.length === 3) {
      return {
        key,
        userId: parseInt(match?.[1] ?? '0', 10),
        fingerprintLight: match[2] as string,
        time: parseInt(match?.[3] ?? '0', 10),
      }
    }
  }

  private get maxRefreshKeysByUser () {
    return (this.configService.get('MAX_REFRESH_TOKENS_BY_USER') ?? 10) >>> 0
  }

  private get prefix (): string {
    return this.configService.get('REDIS_PREFIX') ?? ''
  }

  private async getAllKeys (userId: number, fingerprintLight: string | '*' = '*'): Promise<string[]> {
    const prefix = this.prefix
    const pattern = this.key(userId, fingerprintLight, '*')
    const data = (await this.redis.scan(0, 'MATCH', prefix + pattern))[1]
    const keys = isArray<string>(data) ? data : [] as string[]
    const indexOfTime = Date.now().toString().length

    const all = keys.sort((a, b) => {
      const an = parseInt(a.substr(a.length - indexOfTime), 10)
      const bn = parseInt(b.substr(b.length - indexOfTime), 10)
      return bn - an
    }).map(k => k.substr(prefix.length))

    return all
  }

  private async getFull (userId: number, fingerprintLight: string | '*' = '*'): Promise<FullInfo[]> {
    const keys = await this.getAllKeys(userId, fingerprintLight)
    const usedKeys = keys.slice(0, this.maxRefreshKeysByUser)
    const deletedKeys = keys.slice(this.maxRefreshKeysByUser)

    const map: FullInfo[] = []

    for (const key of usedKeys) {
      const token = await this.redis.get(key)
      const fullInfo = !!token && this.parseKey(key)
      if (token && fullInfo) {
        map.push({
          key,
          userId: fullInfo.userId,
          fingerprintLight: fullInfo.fingerprintLight,
          time: fullInfo.time,
          token,
        });
      }
    }

    await this.removeKeys(deletedKeys)

    return map
  }

  async getAll (userId: number): Promise<string[]> {
    //todo
    const keys = await this.getAllKeys(userId)
    const usedKeys = keys.slice(0, this.maxRefreshKeysByUser)
    const deletedKeys = keys.slice(this.maxRefreshKeysByUser)

    const tokens: string[] = []

    for (const key of usedKeys) {
      const token = await this.redis.get(key)
      if (token) {
        tokens.push(token)
      }
    }

    await this.removeKeys(deletedKeys)

    return tokens
  }

  async add (userId: number, fingerprintLight: string, refreshToken: string, expired: number) {
    const now = Date.now()

    const key = this.key(userId, fingerprintLight, now)
    const result = await this.redis.setex(
      key,
      expired,
      refreshToken,
    )

    //todo write to cookie

    if (result === 'OK') {
      await this.removeOldKeys(userId)
      return true
    }

    return false
  }

  async remove (userId: number, refreshToken: string) {
    const map = await this.getAll(userId)
    for (const [key, token] of Object.entries(map)) {
      if (token === refreshToken) {
        return (await this.removeKeys([key]))
      }
    }
  }

  async removeByFingerprint (userId: number, fingerprintLight: string) {
    const deletedKeys = await this.getAllKeys(userId, fingerprintLight)
    return await this.removeKeys(deletedKeys)
  }

  async removeByUser (userId: number) {
    const deletedKeys = await this.getAllKeys(userId)
    return await this.removeKeys(deletedKeys)
  }

  async has (userId: number, token: string) {
    const tokens = await this.getAll(userId)
    return tokens.includes(token)
  }

  protected async removeOldKeys (userId: number) {
    const keys = (await this.getAllKeys(userId)).slice(this.maxRefreshKeysByUser)
    return this.removeKeys(keys)
  }

  protected async removeKeys (keys: string[]) {
    for (const key of keys) {
      const result = await this.redis.del(key)
    }
  }

  // JWT

  async setLastJwtByFingerprint (userId: number, fingerprintLight: string, lastTime: number) {
    const ex =
      convertSimpleExpiresToSeconds(this.configService.get('JWT_SECRET_EXPIRES_IN') ?? '') ?? 60 /* default 1 minute */

    return await this.redis.setex(
      REDIS_LAST_TIME_KEY(userId, fingerprintLight),
      ex,
      lastTime,
    )
  }

  async getJWTLastGenerateTime (userId: number, fingerprintLight: string): Promise<number> {
    return (await this.redis.get(REDIS_LAST_TIME_KEY(userId, fingerprintLight))) as any ?? (Date.now() / 1000) >>> 0
  }

  async removeAllLastJwt (userId: number) {
    const prefix = this.prefix
    const pattern = REDIS_LAST_TIME_KEY(userId, '*')
    const data = (await this.redis.scan(0, 'MATCH', prefix + pattern))[1]
    const keys = (isArray<string>(data) ? data : [] as string[])
      .map(k => k.substr(prefix.length))

    for (const key of keys) {
      await this.redis.del(key)
    }

    return await this.removeKeys(keys)
  }

  async verifyJwtToken (tokenPayload: JwtStrategyValidatePayload, fingerprintLight: string, user?: IUser) {
    if (fingerprintLight !== tokenPayload.fingerprintLight) {
      throw new UnauthorizedException('jwt - fingerprint not valid');
    }

    if (!user) {
      throw new UnauthorizedException('jwt - user not found');
    }

    if (tokenPayload.sub !== user.id) {
      throw new UnauthorizedException('jwt - incorrect token [id]');
    }

    if (tokenPayload.login !== user.login) {
      throw new UnauthorizedException('jwt - incorrect token [login]');
    }

    const lastTime = await this.getJWTLastGenerateTime(user.id, fingerprintLight)
    if (tokenPayload.lastTime.toString() !== lastTime.toString()) {
      throw new UnauthorizedException('jwt - incorrect token [lastTime]');
    }

    return true
  }
}
