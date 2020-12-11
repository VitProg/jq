import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { UserService } from '../../user/user.service'
import { JwtRefreshTokenStrategyValidatePayload, JwtStrategyValidatePayload } from '../types'
import { SecureService } from '../../secure/secure.service'
import { TokenService } from '../token/token.service'


@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  constructor (
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly secureService: SecureService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.[configService.get('JWT_REFRESH_TOKEN_COOKIE')]
      }]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    })
  }

  async validate (request: Request, payload: JwtRefreshTokenStrategyValidatePayload) {
    const tokenInCookie = request?.cookies?.[this.configService.get('JWT_REFRESH_TOKEN_COOKIE')];

    const userId = payload.sub

    const tokenExist = await this.tokenService.has(userId, tokenInCookie)

    if (!tokenExist) {
      throw new UnauthorizedException('refresh - token not exist')
    }

    const fingerprintLight = await this.secureService.generateFingerprintLight(request)

    if (fingerprintLight !== payload.fingerprintLight) {
      throw new UnauthorizedException('refresh - fingerprint not valid');
    }

    const user = await this.userService.findById(userId)

    if (!user) {
      throw new UnauthorizedException('refresh - user not found');
    }

    // remove token from redis
    await this.tokenService.removeByFingerprint(userId, fingerprintLight)

    return user
  }
}
