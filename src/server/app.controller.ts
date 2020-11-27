import { CacheInterceptor, CacheTTL, Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { stringToParams } from './forum/utils/relations'
import { MessageAllRelations } from '../common/forum/forum.entity-relations'
import { between } from '../common/utils/number'
import { UserService } from './user/user.service'
import { MessageService } from './forum/message/message.service'
import { WithFields } from './user/types'


const ITEMS_ON_PAGE = 50
const MAX_ITEMS_ON_PAGE = 200
const MIN_ITEMS_ON_PAGE = 5

@Controller('api')
export class AppController {
  constructor (
    private readonly userService: UserService,
    private readonly messageService: MessageService,
  ) {
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10)
  @Get('last-messages')
  async lastMessages (
    @Query('page') page = 1,
    @Query('pageSize') pageSize = ITEMS_ON_PAGE,
    @Query('relations') relations?: string
  ) {
    return this.messageService.getLastMessages({
      limit: between(pageSize, MIN_ITEMS_ON_PAGE, MAX_ITEMS_ON_PAGE),
      page,
    }, stringToParams(relations ?? '', MessageAllRelations))
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

  ////
  //
  // @Get('messages')
  // @Render('layout')
  // pages() {
  // }
}
