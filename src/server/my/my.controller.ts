import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { IUser } from '../../common/forum/forum.interfaces'
import { UserService } from '../user/user.service'
import { ProfileResponse } from '../../common/responses/my.responses'

@Controller('api/my')
export class MyController {
  constructor (
    private readonly userService: UserService,
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async index (@Req() request: Request & { user: IUser }): Promise<ProfileResponse | undefined> {
    const userId = request.user.id

    const user = this.userService.getById(userId, ['email', 'permissions', 'groups'])

    return user
  }
}
