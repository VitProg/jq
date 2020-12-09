import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common'
import { IUser } from '../../../../../common/forum/forum.interfaces'
import { TopicManyResponse } from '../responses/topic-many.response'
import { WithUser } from '../../../auth/decorators/with-user'
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ApiPipeNumbers } from '../../../../swagger/decorators/api-pipe-numbers'
import { TopicModel } from '../../models/topic.model'
import { TopicService } from './topic.service'
import { BoardService } from '../board/board.service'
import { User } from '../../../auth/decorators/user'
import { ApiPipeStrings } from '../../../../swagger/decorators/api-pipe-strings'
import { TopicAllRelations, TopicRelationsArray } from '../../../../../common/forum/forum.entity-relations'
import { ParsePipedStringPipe } from '../../../../pipes/parse-piped-string.pipe'
import { ConfigService } from '@nestjs/config'
import { ApiQueryPagination } from '../../../../swagger/decorators/api-query-pagination'
import { ParsePipedIntPipe } from '../../../../pipes/parse-piped-int.pipe'
import { ParseIntOptionalPipe } from '../../../../pipes/parse-int-optional.pipe'


const MAX_ITEMS_ON_PAGE = 200
const MIN_ITEMS_ON_PAGE = 5


@ApiTags('topic')
@Controller('topic')
export class TopicController {
  readonly pageSize = parseInt(this.configService.get('FORUM_TOPIC_PAGE_SIZE', '25'), 10)

  constructor (
    private readonly topicService: TopicService,
    private readonly boardService: BoardService,
    private readonly configService: ConfigService,
  ) {
  }


  @WithUser()
  @Get('')
  @ApiQueryPagination()
  @ApiPipeStrings({
    name: 'relations',
    where: 'query',
    enum: TopicAllRelations,
    enumName: 'TopicAllRelations',
    required: false,
  })
  async findAll (
    @Query('page', new ParseIntOptionalPipe({ min: 1 })) page = 1,
    @Query('pageSize', new ParseIntOptionalPipe({ min: 5 })) pageSize = this.pageSize,
    @Query('relations', new ParsePipedStringPipe()) withRelations: TopicRelationsArray = [],
    @User() user?: IUser,
  ): Promise<TopicManyResponse> {
    const boardIds = await this.boardService.availableBoardIdsForUser(user)

    const data = await this.topicService.paginate({
      boardIds,
      pagination: { page, limit: pageSize },
    })

    data.relations = await this.topicService.getRelations(data.items, withRelations)

    return data
  }

  @WithUser()
  @Get('board/:boardId')
  @ApiParam({ name: 'boardId', type: Number })
  @ApiQueryPagination()
  @ApiPipeStrings({
    name: 'relations',
    where: 'query',
    enum: TopicAllRelations,
    enumName: 'TopicAllRelations',
    required: false,
  })
  async findByBoard (
    @Param('boardId', ParseIntPipe) boardId: number,
    @Query('page', new ParseIntOptionalPipe({ min: 1 })) page = 1,
    @Query('pageSize', new ParseIntOptionalPipe({
      min: MIN_ITEMS_ON_PAGE,
      max: MAX_ITEMS_ON_PAGE
    })) pageSize = this.pageSize,
    @Query('relations', ParsePipedStringPipe) withRelations: TopicRelationsArray = [],
    @User() user?: IUser,
  ): Promise<TopicManyResponse> {
    const boardIds = await this.boardService.availableBoardIdsForUser(user)
    if (boardIds.includes(boardId) === false) {
      throw new NotFoundException('Topics for board not found')
    }

    const data = await this.topicService.paginate({
      boardId,
      pagination: { page, limit: pageSize },
      stickyFirst: true,
    })

    data.relations = await this.topicService.getRelations(data.items, withRelations)

    return data
  }

  @WithUser()
  @Get(':id')
  @ApiQuery({ name: 'id', type: Number })
  async findById (
    @Param('id', ParseIntPipe) id: number,
    @User() user?: IUser
  ): Promise<TopicModel | undefined> {
    const boardIds = await this.boardService.availableBoardIdsForUser(user)
    const result = await this.topicService.findById(id)
    return result && boardIds.includes(result.linksId.board) ? result : undefined
  }

  @WithUser()
  @Get('many/:ids')
  @ApiPipeNumbers('ids', 'param')
  async findByIds (
    @Param('ids', ParsePipedIntPipe) ids: number[],
    @User() user?: IUser,
  ): Promise<TopicModel[]> {
    const boardIds = await this.boardService.availableBoardIdsForUser(user)
    const result = await this.topicService.findByIds(ids)
    return result.filter(item => boardIds.includes(item.linksId.board))
  }

}
