import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { Request } from 'express'
import { UserService } from '../user/user.service'
import { omit } from '../../common/utils/object'
import { JwtService } from '@nestjs/jwt'
import { IUser } from '../../common/forum/forum.interfaces'
import { SecureService } from '../secure/secure.service'
import { userToJwtPayload, userToJwtRefreshPayload } from './utils'
import { ConfigService } from '@nestjs/config'
import { TokenService } from './token/token.service'
import { convertSimpleExpiresToSeconds } from '../common/date'
import { REDIS_CLIENT } from '../di.symbols'
import { RedisClient } from '../types'


@Injectable()
export class AuthService {
  constructor (
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly secureService: SecureService,
    private readonly tokenService: TokenService,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
  ) {
    //
  }

  async validateUser (username: string, password: string): Promise<IUser | undefined> {
    const login = username.includes('@') ? undefined : username
    const email = username.includes('@') ? username : undefined

    const user = await this.userService.getByLoginOrEmail({ login, email })

    if (!user || !user.auth?.passwordHash) {
      return undefined
    }

    const hash = this.secureService.sha1(user.login.toLowerCase() + password)

    if (hash === user.auth.passwordHash) {
      return omit(user, 'auth')
    }

    return undefined
  }

  protected async generateTokens (request: Request & { user: IUser }) {
    const user = request.user

    if (!user) {
      throw new InternalServerErrorException('user empty')
    }

    const lastTime = (Date.now() / 1000) >>> 0
    const fingerprintLight = await this.secureService.generateFingerprintLight(request)
    await this.tokenService.setLastJwtByFingerprint(user.id, fingerprintLight, lastTime)

    // todo добавить бы фингер принт из браузера, надежнее будет

    // todo add last login with increment
    const accessToken = this.jwtService.sign({
      ...userToJwtPayload(user, lastTime, fingerprintLight),
    }, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_SECRET_EXPIRES_IN'),
      algorithm: 'HS512'
    })

    const refreshToken = this.jwtService.sign({
      ...userToJwtRefreshPayload(user, fingerprintLight),
    }, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
      algorithm: 'HS256'
    })

    const ex = convertSimpleExpiresToSeconds(this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN') ?? '')
    if (ex) {
      const saveTokenResult = await this.tokenService.add(user.id, fingerprintLight, refreshToken, ex)

      if (saveTokenResult) {
        //todo write to cookie
      }
    }

    return {
      accessToken,
      refreshToken,
    }
  }

  async login (request: Request & { user: IUser }) {
    // todo не оператся на lastlogin, надо хранить дату последней генерации токена и добавлять ее в генерацию токена!
    // todo lastLogin перезаписывать только при логине, а не рефреше токена,
    //      лучше общую логику вынести в приватный метод и переисползвать в login() и refreshToken()

    await this.logout(request)

    const tokens = await this.generateTokens(request)

    await this.userService.updateLastLogin(request.user.id)

    return tokens
  }

  async refreshToken (request: Request & { user: IUser }) {
    const tokens = await this.generateTokens(request)

    ///todo remove old refresh token

    return tokens
  }

  async logout (request: Request & { user: IUser }) {
    const user = request.user

    if (!user) {
      throw new InternalServerErrorException('user empty')
    }

    const lastTime = (Date.now() / 1000) >>> 0
    const fingerprintLight = await this.secureService.generateFingerprintLight(request)
    await this.tokenService.setLastJwtByFingerprint(user.id, fingerprintLight, lastTime)

    await this.tokenService.removeByFingerprint(user.id, fingerprintLight)
  }

  async logoutAll (request: Request & { user: IUser }) {
    const user = request.user

    if (!user) {
      throw new InternalServerErrorException('user empty')
    }

    // const lastTime = (Date.now() / 1000) >>> 0
    // const fingerprintLight = await this.secureService.generateFingerprintLight(request)
    await this.tokenService.removeAllLastJwt(user.id)
    await this.tokenService.removeByUser(user.id)
  }


}
