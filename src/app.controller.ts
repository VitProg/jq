import { Controller, Get, Param, Query } from '@nestjs/common'
import { ForumService } from './forum/forum.service'


const ITEMS_ON_PAGE = 50

const getLimitsOptions = (page: number) => ({
  limit: ITEMS_ON_PAGE,
  offset: (Math.max(1, page) - 1) * ITEMS_ON_PAGE
})

@Controller()
export class AppController {
  constructor (
    private readonly forumService: ForumService
  ) {
  }


  @Get('last-messages')
  async lastMessages (@Query('page') page = 1) {
    const { limit, offset } = getLimitsOptions(page)
    return this.forumService.getLastMessages(limit, offset)
  }

  @Get('active-users')
  async activeUsers (@Query('page') page = 1) {
    const { limit, offset } = getLimitsOptions(page)
    return this.forumService.getActiveUsers(limit, offset)
  }
}
