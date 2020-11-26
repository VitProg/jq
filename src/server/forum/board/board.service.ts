import { Injectable } from '@nestjs/common'
import { IBoard } from '../../../common/forum/forum.interfaces'
import { ForumCacheService } from '../forum-cache/forum-cache.service'


@Injectable()
export class BoardService {
  constructor (
    private forumCacheService: ForumCacheService
  ) {
  }

  async findByIdsToMap(ids: number[] | Set<number>): Promise<Map<number, IBoard>> {
    const idSet = new Set(ids)

    const map = new Map<number, IBoard>()

    for (const id of idSet) {
      const board = this.forumCacheService.boardMap.get(id)
      if (board) {
        map.set(id, {
          ...board,
          category: this.forumCacheService.categoryMap.get(board.linksId.category)
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
