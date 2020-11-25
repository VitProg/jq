import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { BoardEntity, CategoryEntity } from '../../entities'
import { IBoard, ICategory } from '../../../common/forum/forum.interfaces'
import { Repository } from 'typeorm'
import { toBoard, toBoardMap, toCategory, toCategoryMap } from '../utils/mapper'

@Injectable()
export class CacheService {

  private _boardMap = new Map<number, IBoard>()
  private _categoryMap = new Map<number, ICategory>()

  constructor (
    @InjectRepository(BoardEntity) private readonly boardRepository: Repository<BoardEntity>,
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
  }

  async init() {
    console.log('Init Forum cache')

    const categoryEntityList = await this.categoryRepository.find({
      order: {
        catOrder: 'ASC'
      }
    })
    this._categoryMap = toCategoryMap(categoryEntityList)

    const boardEntityList = await  this.boardRepository.find()
    this._boardMap = toBoardMap(boardEntityList)

    Object.values(this._boardMap).forEach(board => board.category = this._categoryMap.get(board.linksId.category))
  }

  get categoryMap(): ReadonlyMap<number, Readonly<ICategory>> {
    return this._categoryMap
  }

  get boardMap(): ReadonlyMap<number, Readonly<IBoard>> {
    return this._boardMap
  }

}
