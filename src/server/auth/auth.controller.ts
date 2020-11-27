import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { IUser } from '../../common/forum/forum.interfaces'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AuthService } from './auth.service'
import { Request as ExpressRequest } from 'express'
import { RefreshTokenService } from './refresh-token/refresh-token.service'
import { jwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard'


@Controller('api/auth')
export class AuthController {

  constructor (
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {
  }


  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request: ExpressRequest & {user: IUser}) {
    const result = await this.authService.login(request);

    return result
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async user(@Request() request: ExpressRequest & {user: IUser}) {
    const user = request.user;

    return {
      ...user,
    }
  }

  @UseGuards(jwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(@Request() request: ExpressRequest & {user: IUser}) {
    console.log('refreshToken', request)

    const result = await this.authService.refreshToken(request)

    return result
  }

  @Get('smf')
  async smf(@Request() request: ExpressRequest){
    return request.cookies
  }

}
