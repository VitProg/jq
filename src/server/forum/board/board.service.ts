import { Injectable } from '@nestjs/common'
import { CacheService } from '../cache/cache.service'
import { IBoard } from '../../../common/forum/forum.interfaces'


@Injectable()
export class BoardService {
  constructor (
    private cacheService: CacheService
  ) {
  }

  async findByIdsToMap(ids: number[] | Set<number>): Promise<Map<number, IBoard>> {
    const idSet = new Set(ids)

    const map = new Map<number, IBoard>()

    for (const id of idSet) {
      const board = this.cacheService.boardMap.get(id)
      if (board) {
        map.set(id, {
          ...board,
          category: this.cacheService.categoryMap.get(board.linksId.category)
        })
      }
    }

    return map;
  }

  async findByIds(ids: number[] | Set<number>): Promise<IBoard[]> {
    return [...(await this.findByIdsToMap(ids)).values()]
  }

  async findByIdsToRecord(ids: number[] | Set<number>): Promise<Record<number, IBoard>> {
    const map = await this.findByIdsToMap(ids)
    return Object.fromEntries(map.entries())
  }


}
