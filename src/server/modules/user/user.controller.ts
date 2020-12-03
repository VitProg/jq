import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { stringToParams } from '../forum/utils/relations'
import { WithFields } from './types'
import { between } from '../../../common/utils/number'
import { UserService } from './user.service'
import { MessageService } from '../forum/modules/message/message.service'

const ITEMS_ON_PAGE = 50
const MAX_ITEMS_ON_PAGE = 200
const MIN_ITEMS_ON_PAGE = 5

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor (
    private readonly userService: UserService,
  ) {
  }

  @Get('active-users')
  async activeUsers (
    @Query('page') page = 1,
    @Query('pageSize') pageSize = ITEMS_ON_PAGE,
    @Query('with') _withFields: string = 'groups'
  ) {
    let withFields = stringToParams<WithFields>(_withFields ?? '', ['groups', 'permissions'])
    return this.userService.getActiveUsers({
      limit: between(pageSize, MIN_ITEMS_ON_PAGE, MAX_ITEMS_ON_PAGE),
      page,
    }, withFields)
  }

}
