import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { MessageAllRelations, MessageRelationsArray } from '../../../../../common/forum/forum.entity-relations'
import { between } from '../../../../../common/utils/number'
import { MessageService } from './message.service'
import { MessageManyResponse } from '../responses/message-many.response'
import { ApiQueryPagination } from '../../../../swagger/decorators/api-query-pagination'
import { ConfigService } from '@nestjs/config'
import { WithUser } from '../../../auth/decorators/with-user'
import { User } from '../../../auth/decorators/user'
import { IUser } from '../../../../../common/forum/forum.interfaces'
import { BoardService } from '../board/board.service'
import { ApiPipeStrings } from '../../../../swagger/decorators/api-pipe-strings'
import { ParsePipedStringPipe } from '../../../../pipes/parse-piped-string.pipe'
import { ParseIntOptionalPipe } from '../../../../pipes/parse-int-optional.pipe'
import { ApiPipeNumbers } from '../../../../swagger/decorators/api-pipe-numbers'
import { ParsePipedIntPipe } from '../../../../pipes/parse-piped-int.pipe'
import { MessageModel } from '../../models/message.model'


const MAX_ITEMS_ON_PAGE = 200
const MIN_ITEMS_ON_PAGE = 5


@ApiTags('message')
@Controller('message')
export class MessageController {
  readonly pageSize = parseInt(this.configService.get('FORUM_MESSAGE_PAGE_SIZE', '10'), 10)
  readonly latestMaxPages = parseInt(this.configService.get('FORUM_MESSAGE_LATEST_MAX_PAGES', '10'), 10)

  constructor (
    private readonly messageService: MessageService,
    private readonly boardService: BoardService,
    private readonly configService: ConfigService,
  ) {
  }


  @WithUser()
  @Get('latest')
  @ApiQueryPagination()
  @ApiPipeStrings({
    name: 'relations',
    where: 'query',
    enum: MessageAllRelations,
    enumName: 'MessageAllRelations',
    required: false,
  })
  async latest (
    @User() user?: IUser,
    @Query('page', ParseIntOptionalPipe) page = 1,
    @Query('pageSize', ParseIntOptionalPipe) pageSize = this.pageSize,
    @Query('relations', ParsePipedStringPipe) withRelations: MessageRelationsArray = [],
  ): Promise<MessageManyResponse> {
    if (page > this.latestMaxPages) {
      throw new NotFoundException('Maximum number of pages - 10')
    }

    const boardIds = await this.boardService.availableBoardIdsForUser(user)

    const result = await this.messageService.findAll({
      pagination: {
        limit: between(pageSize, MIN_ITEMS_ON_PAGE, MAX_ITEMS_ON_PAGE),
        page,
      },
      boardIds,
      sort: 'DESC',
    })
    result.meta.totalPages = Math.min(this.latestMaxPages, result.meta.totalPages)

    result.relations = await this.messageService.getRelations(result.items, withRelations)

    return result
  }


  @WithUser()
  @Get('topic/:topicId')
  @ApiQueryPagination()
  @ApiPipeStrings({
    name: 'relations',
    where: 'query',
    enum: MessageAllRelations,
    enumName: 'MessageAllRelations',
    required: false,
  })
  async findByTopic (
    @Param('topicId', ParseIntPipe) topicId: number,
    @Query('page', ParseIntOptionalPipe) page = 1,
    @Query('pageSize', ParseIntOptionalPipe) pageSize = this.pageSize,
    @Query('relations', ParsePipedStringPipe) withRelations: MessageRelationsArray = [],
    @User() user?: IUser,
  ): Promise<MessageManyResponse> {
    const boardIds = await this.boardService.availableBoardIdsForUser(user)

    const result = await this.messageService.findAll({
      pagination: {
        limit: between(pageSize, MIN_ITEMS_ON_PAGE, MAX_ITEMS_ON_PAGE),
        page,
      },
      topicId,
      boardIds,
    })

    result.relations = await this.messageService.getRelations(result.items, withRelations)

    return result
  }

  @WithUser()
  @Get(':id')
  @ApiQuery({ name: 'id', type: Number })
  async findById (
    @Param('id', ParseIntPipe) id: number,
    @User() user?: IUser,
  ): Promise<MessageModel | undefined> {
    const boardIds = await this.boardService.availableBoardIdsForUser(user)
    const result = await this.messageService.findById(id)
    return result && boardIds.includes(result.linksId.board) ? result : undefined
  }

  @WithUser()
  @Get('many/:ids')
  @ApiPipeNumbers('ids', 'param')
  async findByIds (
    @Param('ids', ParsePipedIntPipe) ids: number[],
    @User() user?: IUser,
  ): Promise<MessageModel[]> {
    const boardIds = await this.boardService.availableBoardIdsForUser(user)
    const result = await this.messageService.findByIds(ids)
    return result.filter(item => boardIds.includes(item.linksId.board))
  }


}
