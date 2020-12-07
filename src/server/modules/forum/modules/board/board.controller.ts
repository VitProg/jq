import { CacheInterceptor, CacheTTL, Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { BoardService } from './board.service'
import { omit } from '../../../../../common/utils/object'
import { BoardModel } from '../../models/board.model'
import { ApiPipeNumbersParam } from '../../../../swagger/decorators/api-pipe-numbers-param'
import { WithUserGuard } from '../../../auth/guards/with-user.guard'
import { WithUser } from '../../../auth/decorators/with-user'
import { User } from '../../../auth/decorators/user'
import { IUser } from '../../../../../common/forum/forum.interfaces'
import { getUserGroups } from '../../../../../common/forum/utils'


const DEVELOPMENT = process.env.NODE_ENV !== 'production'

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor (
    private readonly boardService: BoardService
  ) {
  }

  @WithUser()
  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(DEVELOPMENT ? 5 : 60)
  @Get()
  @ApiQuery({ name: 'parentId', type: Number })
  // @ApiQuery({ name: 'forGroups', type: [Number] })
  async findAll (@User() user?: IUser, parentId: number = 0/*, forGroups: number[] = [-1]*/): Promise<BoardModel[]> {
    const forGroups = getUserGroups(user)
    const result = await this.boardService.findAll(parentId, forGroups)
    return result.map(board => omit(board, 'forGroups'))
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(DEVELOPMENT ? 5 : 60)
  @Get(':id')
  @ApiQuery({ name: 'id', type: Number })
  async findOne (@Param('id') id: string): Promise<BoardModel | undefined> {
    const result = await this.boardService.findOne(id)
    return result ? omit(result, 'forGroups') : undefined
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(DEVELOPMENT ? 5 : 60)
  @Get('many/:ids')
  @ApiPipeNumbersParam('ids')
  async findByIds (@Param('ids') ids: string): Promise<BoardModel[]> {
    const idArray = ids.split(/[^\d]/).filter(Boolean).map<number>(id => parseInt(id, 10))
    const result = await this.boardService.findByIds(idArray)
    return result.map(board => omit(board, 'forGroups'))
  }
}
