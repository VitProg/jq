import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BoardEntity, CategoryEntity } from '../../entities'
import { IBoard, ICategory } from '../../../common/forum/forum.interfaces'
import { Repository } from 'typeorm'
import { toBoard, toBoardMap, toCategory, toCategoryMap, toMap } from '../utils/mapper'
import { RedisService } from 'nestjs-redis'
import { safeJsonParse } from '../../../common/utils/json'
import { REDIS_CLIENT } from '../../di.symbols'
import { RedisClient } from '../../types'

const BOARDS_KEY = 'cache.boards'
const CATEGORIES_KEY = 'cache.categories'
const EXPIRED = 3600 // 1 hour
const EXPIRED_LOCAL = 300 // 5 min

@Injectable()
export class ForumCacheService {

  private _boardMap: Map<number, IBoard> = new Map<number, IBoard>()
  private _categoryMap: Map<number, ICategory> = new Map<number, ICategory>()

  private expiredAt = 0
  private refreshing = false

  constructor (
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
    @InjectRepository(BoardEntity) private readonly boardRepository: Repository<BoardEntity>,
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
  }

  //todo add auto refresh when expired

  get isExpired() {
    return this.expiredAt > Date.now()
  }

  async refresh() {
    console.log('ForumCache refresh...')

    this.refreshing = true
    this.expiredAt = Date.now() + EXPIRED_LOCAL

    const categoriesFromRedis = safeJsonParse<ICategory[]>(await this.redis.get(CATEGORIES_KEY))
    if (categoriesFromRedis) {
      console.log(' - categories from redis')
      this._categoryMap = toMap(categoriesFromRedis);
    } else {
      console.log(' - categories from DB')
      const categoryEntityList = await this.categoryRepository.find({
        order: {
          catOrder: 'ASC'
        }
      })
      this._categoryMap = toCategoryMap(categoryEntityList)
      await this.redis.setex(CATEGORIES_KEY, EXPIRED, JSON.stringify([...this._categoryMap.values()]))
    }

    const boardsFromRedis = safeJsonParse<IBoard[]>(await this.redis.get(BOARDS_KEY))
    if (boardsFromRedis) {
      console.log(' - boards from redis')
      this._boardMap = toMap(boardsFromRedis)
    } else {
      console.log(' - boards from DB')
      const boardEntityList = await  this.boardRepository.find()
      this._boardMap = toBoardMap(boardEntityList)
      Object.values(this._boardMap).forEach(board => board.category = this._categoryMap.get(board.linksId.category))
      await this.redis.setex(BOARDS_KEY, EXPIRED, JSON.stringify([...this._boardMap.values()]))
    }

    this.refreshing = false

    console.log('ForumCache refresh complete')
  }

  get categoryMap(): ReadonlyMap<number, Readonly<ICategory>> {
    if (this.isExpired && !this.refreshing) {
      this.refresh()
        .catch(e => console.warn(e))
    }
    return this._categoryMap
  }

  get boardMap(): ReadonlyMap<number, Readonly<IBoard>> {
    if (this.isExpired && !this.refreshing) {
      this.refresh()
        .catch(e => console.warn(e))
    }
    return this._boardMap
  }

}
