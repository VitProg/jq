import { CacheInterceptor, CacheTTL, Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common'
import { ForumService } from './forum/forum.service'
import { stringToRelationsArray } from './forum/relations'
import { MessageAllRelations, MessageRelationsArray } from '../common/forum.entity-repations'
import { between } from '../common/utils/number'


const ITEMS_ON_PAGE = 50
const MAX_ITEMS_ON_PAGE = 200
const MIN_ITEMS_ON_PAGE = 5

@Controller()
export class AppController {
  constructor (
    private readonly forumService: ForumService
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
    return this.forumService.getLastMessages({
      limit: between(pageSize, MIN_ITEMS_ON_PAGE, MAX_ITEMS_ON_PAGE),
      page,
    }, stringToRelationsArray(relations ?? '', MessageAllRelations))
  }

  @Get('active-users')
  async activeUsers (
    @Query('page') page = 1,
    @Query('pageSize') pageSize = ITEMS_ON_PAGE,
  ) {
    return this.forumService.getActiveUsers({
      limit: between(pageSize, MIN_ITEMS_ON_PAGE, MAX_ITEMS_ON_PAGE),
      page,
    })
  }
}
