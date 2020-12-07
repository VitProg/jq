import { Injectable } from '@nestjs/common'
import { IBoard, IUser } from '../../../../../common/forum/forum.interfaces'
import { ForumCacheService } from '../forum-cache/forum-cache.service'
import { getUserGroups } from '../../../../../common/forum/utils'


@Injectable()
export class BoardService {
  constructor (
    private readonly cacheService: ForumCacheService
  ) {
  }

  async availableBoardIdsForUser (user?: IUser): Promise<number[]> {
    const userGroups = getUserGroups(user)
    const boards = await this.findAll(0, userGroups)
    return boards.map(board => board.id)
  }

  async findAll (parentId: number = 0, forGroups: number[] = [-1] /**todo**/): Promise<IBoard[]> {
    const boardMap = await this.cacheService.getBoardMap()
    const boardArray = [...boardMap.values()]
    return boardArray
      .filter(board => board.linksId.parent === parentId)
      .filter(board => forGroups.length && board.forGroups ? forGroups.some(g => board.forGroups!.includes(g)) : true)
  }


  async findOne (id: string): Promise<IBoard | undefined> {
    return (await this.cacheService.getBoardMap()).get(+id)
  }


  async findByIdsToMap (ids: number[] | Set<number>): Promise<Map<number, IBoard>> {
    const idSet = new Set(ids)
    const boardMap = await this.cacheService.getBoardMap()

    return new Map<number, IBoard>(
      [...boardMap.entries()]
        .filter(([id]) => idSet.has(id))
    )
  }

  async findByIds (ids: number[] | Set<number>): Promise<IBoard[]> {
    return [...(await this.findByIdsToMap(ids)).values()]
  }

  async findByIdsToRecord (ids: number[] | Set<number>): Promise<Record<number, IBoard>> {
    const map = await this.findByIdsToMap(ids)
    return Object.fromEntries(map.entries())
  }

}
