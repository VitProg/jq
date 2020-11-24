import { Injectable } from '@nestjs/common'
import { CacheService } from '../cache/cache.service'
import { Board } from '../../../common/forum/forum.entities'


@Injectable()
export class BoardService {
  constructor (
    private cacheService: CacheService
  ) {
  }

  async findByIdsToMap(ids: number[] | Set<number>): Promise<Map<number, Board>> {
    const idSet = new Set(ids)

    const map = new Map<number, Board>()

    for (const id of idSet) {
      const board = this.cacheService.boardMap.get(id)
      if (board) {
        map.set(id, board)
      }
    }

    return map;
  }

  async findByIds(ids: number[] | Set<number>): Promise<Board[]> {
    return [...(await this.findByIdsToMap(ids)).values()]
  }

  async findByIdsToRecord(ids: number[] | Set<number>): Promise<Record<number, Board>> {
    const map = await this.findByIdsToMap(ids)
    return Object.fromEntries(map.entries())
  }


}
