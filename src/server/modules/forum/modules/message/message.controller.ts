import { CacheInterceptor, CacheTTL, Controller, Get, Query, UseInterceptors } from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { MessageAllRelations } from '../../../../../common/forum/forum.entity-relations'
import { between } from '../../../../../common/utils/number'
import { stringToParams } from '../../utils/relations'
import { UserService } from '../../../user/user.service'
import { MessageService } from './message.service'
import { LatestMessageResponse } from '../../responses/latest-message.response'
import { ApiQueryPagination } from '../../../../swagger/decorators/api-query-pagination'
import { MessageModel } from '../../models/message.model'

const ITEMS_ON_PAGE = 50
const MAX_ITEMS_ON_PAGE = 200
const MIN_ITEMS_ON_PAGE = 5


@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor (
    private readonly messageService: MessageService,
  ) {
  }


  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10)
  @Get('latest')
  @ApiQueryPagination()
  @ApiQuery({
    name: 'relations',
    type: String,
    description: `List of relations <i>${[...MessageAllRelations.values()].join(', ')}</i> (comma separator)`,
    examples: {
      'with Users': {value: 'user'},
      'with Board': {value: 'board'},
      'with Topic': {value: 'topic'},
      'with Board and Topic': {value: 'topic,board'},
      'ALL': {value: 'user,board,topic'},
    },
    // enumName: 'MessageAllRelations',
    required: false,
  })
  async latest (
    @Query('page') page = 1,
    @Query('pageSize') pageSize = ITEMS_ON_PAGE,
    @Query('relations') relations?: string
  ): Promise<LatestMessageResponse> {
    return this.messageService.getLastMessages({
      limit: between(pageSize, MIN_ITEMS_ON_PAGE, MAX_ITEMS_ON_PAGE),
      page,
    }, stringToParams(relations ?? '', MessageAllRelations))
  }


}
