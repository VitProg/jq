import { Injectable } from '@nestjs/common';
import { Board, Topic } from '../../../common/forum/forum.entities'
import { InjectRepository } from '@nestjs/typeorm'
import { BoardEntity, TopicEntity } from '../../entities'
import { Repository } from 'typeorm'
import { toTopicMap } from '../utils/mapper'

@Injectable()
export class TopicService {
  constructor (
    @InjectRepository(TopicEntity) private readonly topicRepository: Repository<TopicEntity>,
  ) {
  }

  async findByIdsToMap(ids: number[] | Set<number>): Promise<Map<number, Topic>> {
    const idSet = new Set(ids)
    const map = new Map<number, Topic>()
    const entities = await this.topicRepository.findByIds([...idSet])
    return toTopicMap(entities);
  }

  async findByIds(ids: number[] | Set<number>): Promise<Topic[]> {
    return [...(await this.findByIdsToMap(ids)).values()]
  }

  async findByIdsToRecord(ids: number[] | Set<number>): Promise<Record<number, Topic>> {
    const map = await this.findByIdsToMap(ids)
    return Object.fromEntries(map.entries())
  }
}
