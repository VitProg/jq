import { Inject, Injectable } from '@nestjs/common'
import { REDIS_CLIENT } from '../../di.symbols'
import { RedisClient } from '../../types'
import { ConfigService } from '@nestjs/config'
import { isArray } from '../../../common/type-guards'
import { JwtService } from '@nestjs/jwt'


const KEY_PREFIX = 'refresh-token'

@Injectable()
export class RefreshTokenService {

  constructor (
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
  ) {
  }

  private key(userId: number, time: number | '*' = '*') {
    return `${KEY_PREFIX}.${userId}.${time}`
  }

  private get maxRefreshKeysByUser() {
    return (this.configService.get('MAX_REFRESH_TOKENS_BY_USER') ?? 10) >>> 0
  }

  private get prefix(): string {
    return this.configService.get('REDIS_PREFIX') ?? ''
  }

  private async getAllKeys(userId: number): Promise<string[]> {
    const prefix = this.prefix
    const pattern = this.key(userId, '*')
    const data = (await this.redis.scan(0, 'MATCH', prefix + pattern))[1]
    const keys = isArray<string>(data) ? data : [] as string[]
    const indexOfTime = (this.prefix + this.key(userId, '*')).length - 1

    return keys.sort((a, b) => {
      const an = parseInt(a.substr(indexOfTime), 10)
      const bn = parseInt(b.substr(indexOfTime), 10)
      return bn - an
    }).map(k => k.substr(prefix.length))
  }

  async getAll(userId: number): Promise<string[]> {
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

  async add(userId: number, refreshToken: string, expired: number) {
    const now = Date.now()

    const key = this.key(userId, now)

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

    return  false
  }

  async tokenExist(userId: number, token: string) {
    const tokens = await this.getAll(userId)
    return tokens.includes(token)
  }

  protected async removeOldKeys(userId: number) {
    const keys = (await this.getAllKeys(userId)).slice(this.maxRefreshKeysByUser)
    return this.removeKeys(keys)
  }

  protected async removeKeys(keys: string[]) {
    for (const key of keys) {
      await this.redis.del(key)
    }
  }

}
