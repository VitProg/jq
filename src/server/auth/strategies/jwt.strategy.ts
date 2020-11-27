import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../../user/user.service'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { JwtSignPayload, JwtStrategyValidatePayload } from '../types'
import { SecureService } from '../../secure/secure.service'
import { lastLoginForJwt } from '../utils'
import { AuthService } from '../auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly secureService: SecureService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtStrategyValidatePayload) {
    const fingerprintLight = await this.secureService.generateFingerprintLight(request);

    if (fingerprintLight !== payload.fingerprintLight) {
      throw new UnauthorizedException('fingerprint not valid');
    }

    const user = await this.userService.getById(payload.sub)

    if (!user) {
      throw new UnauthorizedException();
    }

    if (payload.sub !== user.id) {
      throw new UnauthorizedException('incorrect jwt token [id]');
    }

    if (payload.login !== user.login) {
      throw new UnauthorizedException('incorrect jwt token [login]');
    }

    const lastTime = await this.authService.getJWTLastGenerateTime(user.id)
    if (payload.lastTime.toString() !== lastTime.toString()) {
      throw new UnauthorizedException('incorrect jwt token [lastTime]');
    }

    return user
  }
}
