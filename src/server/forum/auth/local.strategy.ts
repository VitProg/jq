import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(loginOrEmail: string, password: string): Promise<any> {
    const login = loginOrEmail.includes('@') ? undefined : loginOrEmail;
    const email = loginOrEmail.includes('@') ? loginOrEmail : undefined;
    const user = await this.authService.validateUser(login, email, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
