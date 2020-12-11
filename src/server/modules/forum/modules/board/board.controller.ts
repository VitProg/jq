import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common'
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger'
import { BoardService } from './board.service'
import { BoardModel } from '../../models/board.model'
import { ApiPipeNumbers } from '../../../../swagger/decorators/api-pipe-numbers'
import { WithUser } from '../../../auth/decorators/with-user'
import { User } from '../../../auth/decorators/user'
import { IBoard, IUser } from '../../../../../common/forum/forum.interfaces'
import { getUserGroups } from '../../../../../common/forum/utils'
import { ParsePipedStringPipe } from '../../../../pipes/parse-piped-string.pipe'
import { BoarAllRelations, BoardRelationsArray } from '../../../../../common/forum/forum.entity-relations'
import { BoardManyResponse } from '../responses/board-many.response'
import { MessageService } from '../message/message.service'
import { boardWithoutGroups } from '../../utils/omit'
import { ParsePipedIntPipe } from '../../../../pipes/parse-piped-int.pipe'
import { ParseIntOptionalPipe } from '../../../../pipes/parse-int-optional.pipe'
import { ApiPipeStrings } from '../../../../swagger/decorators/api-pipe-strings'
import { BoardDynamicDataDto } from '../../dto/board-dynamic-data.dto'
import { GetDynamicDataTdo } from './dto/get-dynamic-data.tdo'


const DEVELOPMENT = process.env.NODE_ENV !== 'production'

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor (
    private readonly boardService: BoardService,
    private readonly messageService: MessageService,
  ) {
  }

  @WithUser()
  @Get()
  @ApiQuery({ name: 'parentId', type: Number, required: false })
  @ApiPipeStrings({
    name: 'relations',
    where: 'query',
    description: BoarAllRelations.join('|'),
    enum: BoarAllRelations,
    enumName: 'BoarAllRelations',
    required: false,
  })
  async findAll (
    @User() user?: IUser,
    @Query('parentId', ParseIntOptionalPipe) parentId: number = 0,
    @Query('relations', new ParsePipedStringPipe()) withRelations: BoardRelationsArray = [],
  ): Promise<BoardManyResponse> {
    const forGroups = getUserGroups(user)
    const result = await this.boardService.findAll(parentId, forGroups)
    const data: IBoard[] = result.map(board => boardWithoutGroups(board))

    const relations = await this.boardService.getRelations(data, withRelations)

    return {
      items: data,
      relations,
    }
  }

  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(DEVELOPMENT ? 5 : 60)
  @Get(':id')
  @ApiQuery({ name: 'id', type: Number })
  async findOne (@Param('id', ParseIntPipe) id: number): Promise<BoardModel | undefined> {
    const result = await this.boardService.findOne(id)
    return result ? boardWithoutGroups(result) : undefined
  }

  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(DEVELOPMENT ? 5 : 60)
  @Get('many/:ids')
  @ApiPipeNumbers('ids', 'param')
  async findByIds (@Param('ids', ParsePipedIntPipe) ids: number[]): Promise<BoardModel[]> {
    const result = await this.boardService.findByIds(ids)
    return result.map(board => boardWithoutGroups(board))
  }

  @Get('stat')
  @ApiPipeNumbers('ids', 'param')
  async getDynamicData (@Param('ids', ParsePipedIntPipe) ids: number[]): Promise<Array<BoardDynamicDataDto>> {
    return this.boardService.getDynamicData(ids)
  }

  // todo улучшить ответ, связанные даные можно отдавать отдельно, так не будет дублей, а в основной записе массива отдавать только ID
  @Post('stat')
  @ApiBody({ type: GetDynamicDataTdo })
  async getDynamicDataPost (@Body() dto: GetDynamicDataTdo): Promise<Array<BoardDynamicDataDto>> {
    return this.boardService.getDynamicData(dto.ids, !!dto.withUser)
  }
}
