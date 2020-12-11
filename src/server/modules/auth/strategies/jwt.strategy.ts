import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../../user/user.service'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { JwtStrategyValidatePayload } from '../types'
import { SecureService } from '../../secure/secure.service'
import { AuthService } from '../auth.service'
import { TokenService } from '../token/token.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly secureService: SecureService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtStrategyValidatePayload) {
    const fingerprintLight = await this.secureService.generateFingerprintLight(request);

    const user = await this.userService.findById(payload.sub)

    if (await this.tokenService.verifyJwtToken(payload, fingerprintLight, user)) {
      return user
    }

    throw new UnauthorizedException('jwt - not valid token');
  }
}
