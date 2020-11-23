import { Controller, Get, Param, Query } from '@nestjs/common'
import { ForumService } from './forum/forum.service'
import { stringToRelationsArray } from './forum/relations'
import { MessageAllRelations, MessageRelationsArray } from '../common/forum.entity-repations'


const ITEMS_ON_PAGE = 50

@Controller()
export class AppController {
  constructor (
    private readonly forumService: ForumService
  ) {
  }


  @Get('last-messages')
  async lastMessages (
    @Query('page') page = 1,
    @Query('relations') relations?: string
  ) {
    return this.forumService.getLastMessages({
      limit: ITEMS_ON_PAGE,
      page,
    }, stringToRelationsArray(relations ?? '', MessageAllRelations))
  }

  @Get('active-users')
  async activeUsers (
    @Query('page') page = 1
  ) {
    return this.forumService.getActiveUsers({
      limit: ITEMS_ON_PAGE,
      page,
    })
  }
}
