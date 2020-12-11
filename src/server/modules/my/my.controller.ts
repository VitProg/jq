import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { IUser } from '../../../common/forum/forum.interfaces'
import { UserService } from '../user/user.service'
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger'
import { ProfileResponse } from './responses/profile.response'
import { createUserModel } from '../../../common/forum/fabrics/create-user.fabric'

@ApiTags('my')
@ApiBearerAuth()
@Controller('my')
export class MyController {
  constructor (
    private readonly userService: UserService,
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiUnauthorizedResponse()
  async index (@Req() request: Request & { user: IUser }): Promise<ProfileResponse | undefined> {
    const userId = request.user.id

    const user = await this.userService.findById(userId, ['email', 'permissions', 'groups'])

    return createUserModel(user)
  }
}
