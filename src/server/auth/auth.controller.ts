import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { IUser } from '../../common/forum/forum.interfaces'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { jwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard'
import { omit } from '../../common/utils/object'
import { RefreshTokenResponse } from '../../common/responses/auth.responses'


@Controller('api/auth')
export class AuthController {

  constructor (
    private readonly authService: AuthService,
  ) {
  }


  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login (
    @Req() request: Request & { user: IUser },
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(request)

    if (result.cookie) {
      const {name, ...options} = result.cookie
      response.cookie(name, result.refreshToken, options)
    }

    return omit(result, 'cookie', 'refreshToken')
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout (
    @Req() request: Request & { user: IUser },
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.logout(request)

    if (result.cookie) {
      const {name, ...options} = result.cookie
      response.cookie(name, '', options)
    }

    return omit(result, 'cookie')
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll (
    @Req() request: Request & { user: IUser },
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.logoutAll(request)

    if (result.cookie) {
      const {name, ...options} = result.cookie
      response.cookie(name, '', options)
    }

    return omit(result, 'cookie')
  }

  @UseGuards(jwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken (
    @Req() request: Request & { user: IUser },
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponse> {
    const result = await this.authService.refreshToken(request)

    if (result.cookie) {
      const {name, ...options} = result.cookie
      response.cookie(name, result.refreshToken, options)
    }

    return omit(result, 'cookie', 'refreshToken')
  }

  @Post('smf')
  async smf (
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return request.cookies
    // if (result.cookie) {
    //   const {name, ...options} = result.cookie
    //   response.cookie(name, result.refreshToken, options)
    // }
    // return omit(result, 'cookie')

  }

  //
  // @UseGuards(JwtAuthGuard)
  // @Get('user')
  // async user (@Req() request: Request & { user: IUser }) {
  //   const user = request.user
  //
  //   return {
  //     ...user,
  //   }
  // }


}
