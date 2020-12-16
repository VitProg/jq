import { Controller, Get, Query } from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { BoardDbService } from './board-db.service'
import { WithUser } from '../../auth/decorators/with-user'
import { User } from '../../auth/decorators/user'
import { getUserLevel } from '../../../../common/forum/utils'
import { ParseIntOptionalPipe } from '../../../pipes/parse-int-optional.pipe'
import { BoardService } from './board.service'
import { IBoardEx, IUserEx } from '../../../../common/forum/forum.ex.interfaces'
import { Sorting } from '../../../types'


const DEVELOPMENT = process.env.NODE_ENV !== 'production'

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor (
    private readonly boardDbService: BoardDbService,
    private readonly boardService: BoardService,
  ) {
  }

  // @WithUser()
  // @Get()
  // @ApiQuery({ name: 'parentId', type: Number, required: false })
  // @ApiPipeStrings({
  //   name: 'relations',
  //   where: 'query',
  //   description: BoarAllRelations.join('|'),
  //   enum: BoarAllRelations,
  //   enumName: 'BoarAllRelations',
  //   required: false,
  // })
  // async findAll (
  //   @User() user?: IUser,
  //   @Query('parentId', ParseIntOptionalPipe) parentId: number = 0,
  //   @Query('relations', new ParsePipedStringPipe()) withRelations: BoardRelationsArray = [],
  // ): Promise<BoardManyResponse> {
  //   const forGroups = getUserGroups(user)
  //   const result = await this.boardDbService.findAll(parentId, forGroups)
  //   const data: IBoard[] = result.map(board => boardWithoutGroups(board))
  //
  //   const relations = await this.boardDbService.getRelations(data, withRelations)
  //
  //   return {
  //     items: data,
  //     relations,
  //   }
  // }
  //
  //
  //
  // // @UseInterceptors(CacheInterceptor)
  // // @CacheTTL(DEVELOPMENT ? 5 : 60)
  // @Get('many/:ids')
  // @ApiPipeNumbers('ids', 'param')
  // async findByIds (@Param('ids', ParsePipedIntPipe) ids: number[]): Promise<BoardModel[]> {
  //   const result = await this.boardDbService.findByIds(ids)
  //   return result.map(board => boardWithoutGroups(board))
  // }

  // @CacheTTL(20)
  // @UseInterceptors(CacheInterceptor)
  @WithUser()
  @Get('')
  @ApiQuery({ name: 'parent', type: Number, required: false })
  @ApiQuery({ name: 'level', type: Number, required: false })
  @ApiQuery({ name: 'category', type: Number, required: false })
  @ApiQuery({ name: 'order', type: String, required: false }) // ToDo !!!
  @ApiQuery({ name: 'sorting', type: String, required: false }) // ToDo !!!
  async getAll (
    @User() user?: IUserEx,
    @Query('parent', ParseIntOptionalPipe) parent?: number,
    @Query('level', ParseIntOptionalPipe) level?: number,
    @Query('category', ParseIntOptionalPipe) category?: number,
    @Query('order') order?: string,
    @Query('sorting') sorting?: Sorting,
  ): Promise<IBoardEx[]> {
    // const userLevel = randomItem(Object.values(UserLevel)) ?? UserLevel.guest// getUserLevel(user)
    const userLevel = getUserLevel(user)

    return this.boardService.findAll({
      userLevel,
      orderBy: order as any,
      sorting: sorting ?? 'asc',
      withGroups: false,
      categoryId: category,
      parentId: parent,
      level,
    })
  }


  // @CacheTTL(20)
  // @UseInterceptors(CacheInterceptor)
  // @Get('stat')
  // @ApiPipeNumbers('ids', 'param')
  // async getDynamicData (@Param('ids', ParsePipedIntPipe) ids: number[]): Promise<Array<BoardDynamicDataDto>> {
  //   return this.boardDbService.getDynamicData(ids)
  // }
  //
  //
  // // todo улучшить ответ, связанные даные можно отдавать отдельно, так не будет дублей, а в основной записе массива отдавать только ID
  // @Post('stat')
  // @ApiBody({ type: GetDynamicDataDto })
  // async getDynamicDataPost (@Body() dto: GetDynamicDataDto): Promise<Array<BoardDynamicDataDto>> {
  //   return this.boardDbService.getDynamicData(dto.ids, !!dto.withUser)
  // }
  //
  // // @UseInterceptors(CacheInterceptor)
  // // @CacheTTL(DEVELOPMENT ? 5 : 60)
  // @Get(':id')
  // @ApiQuery({ name: 'id', type: Number })
  // async findOne (@Param('id', ParseIntPipe) id: number): Promise<BoardModel | undefined> {
  //   const result = await this.boardDbService.findOne(id)
  //   return result ? boardWithoutGroups(result) : undefined
  // }
}
