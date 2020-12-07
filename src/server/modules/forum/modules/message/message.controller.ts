import { CacheInterceptor, CacheTTL, Controller, Get, NotFoundException, Query, UseInterceptors } from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { MessageAllRelations } from '../../../../../common/forum/forum.entity-relations'
import { between } from '../../../../../common/utils/number'
import { stringToParams } from '../../utils/relations'
import { MessageService } from './message.service'
import { LatestMessageResponse } from '../../responses/latest-message.response'
import { ApiQueryPagination } from '../../../../swagger/decorators/api-query-pagination'
import { ConfigService } from '@nestjs/config'
import { WithUser } from '../../../auth/decorators/with-user'
import { User } from '../../../auth/decorators/user'
import { IUser } from '../../../../../common/forum/forum.interfaces'
import { BoardService } from '../board/board.service'
import { getUserGroups } from '../../../../../common/forum/utils'
import { getUserFromContext } from '../../../auth/utils'


const ITEMS_ON_PAGE = 50
const MAX_ITEMS_ON_PAGE = 200
const MIN_ITEMS_ON_PAGE = 5


@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor (
    private readonly messageService: MessageService,
    private readonly boardService: BoardService,
    private readonly configService: ConfigService,
  ) {
  }


  @WithUser()
  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(function(ctx) {
  //   return getUserFromContext(ctx) ? 10 : -1
  // })
  @Get('latest')
  @ApiQueryPagination()
  @ApiQuery({
    name: 'relations',
    type: String,
    description: `List of relations <i>${[...MessageAllRelations.values()].join(', ')}</i> (comma separator)`,
    examples: {
      'with Users': { value: 'user' },
      'with Board': { value: 'board' },
      'with Topic': { value: 'topic' },
      'with Board and Topic': { value: 'topic,board' },
      'ALL': { value: 'user,board,topic' },
    },
    // enumName: 'MessageAllRelations',
    required: false,
  })
  async latest (
    @User() user?: IUser,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = ITEMS_ON_PAGE,
    @Query('relations') relations?: string
  ): Promise<LatestMessageResponse> {
    if (page > parseInt(this.configService.get('FORUM_MESSAGE_PAGE_SIZE', '10'), 10)) {
      throw new NotFoundException()
    }

    const boardIds = await this.boardService.availableBoardIdsForUser(user)

    return this.messageService.getLastMessages(
      {
        limit: between(pageSize, MIN_ITEMS_ON_PAGE, MAX_ITEMS_ON_PAGE),
        page,
      },
      stringToParams(relations ?? '', MessageAllRelations),
      boardIds,
    )
  }


}
