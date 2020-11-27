import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { UserService } from '../../user/user.service'
import { JwtRefreshTokenStrategyValidatePayload, JwtStrategyValidatePayload } from '../types'
import { SecureService } from '../../secure/secure.service'
import { RefreshTokenService } from '../refresh-token/refresh-token.service'


@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  constructor (
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly secureService: SecureService,
    private readonly refreshTokenService: RefreshTokenService,
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

    const tokenExist = await this.refreshTokenService.tokenExist(payload.sub, tokenInCookie)

    if (!tokenExist) {
      throw new UnauthorizedException('refresh token not exist')
    }

    const fingerprintLight = await this.secureService.generateFingerprintLight(request)

    if (fingerprintLight !== payload.fingerprintLight) {
      throw new UnauthorizedException('fingerprint not valid');
    }

    const user = await this.userService.getById(payload.sub)

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    return user
  }
}
