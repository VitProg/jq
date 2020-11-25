import { Injectable } from '@nestjs/common';
import { IBoard, ITopic } from '../../../common/forum/forum.interfaces'
import { InjectRepository } from '@nestjs/typeorm'
import { AttachmentEntity, BoardEntity, MemberEntity, RelatedSubjectEntity, TopicEntity } from '../../entities'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { toTopic, toTopicMap, toUser, toUserMap } from '../utils/mapper'
import { AnyObject } from '../../../common/utils/object'

@Injectable()
export class TopicService {
  constructor (
    @InjectRepository(TopicEntity) private readonly topicRepository: Repository<TopicEntity>,
  ) {
  }

  private query(): SelectQueryBuilder<TopicEntity> {
    return this.topicRepository
      .createQueryBuilder()
      .addSelect('rs.subject as subject')
      .leftJoin(RelatedSubjectEntity, 'rs', `rs.id_topic = ${TopicEntity.name}.id_topic`)
  }

  private rawToItems(data: {entities: TopicEntity[], raw: AnyObject[]}) {
    return data.entities.map((value: any, index: number) => ({
      ...value,
      subject: data.raw[index]?.subject,
    })).map(m => toTopic(m))
  }

  private rawToMap(data: {entities: TopicEntity[], raw: AnyObject[]}) {
    return toTopicMap(data.entities.map((value: any, index: number) => ({
      ...value,
      subject: data.raw[index]?.subject,
    })))
  }


  async findByIdsToMap(ids: number[] | Set<number>): Promise<Map<number, ITopic>> {
    const idSet = new Set(ids)
    const data = await this.query()
      .whereInIds([...idSet])
      .getRawAndEntities()
    return this.rawToMap(data)
  }

  async findByIds(ids: number[] | Set<number>): Promise<ITopic[]> {
    return [...(await this.findByIdsToMap(ids)).values()]
  }

  async findByIdsToRecord(ids: number[] | Set<number>): Promise<Record<number, ITopic>> {
    const map = await this.findByIdsToMap(ids)
    return Object.fromEntries(map.entries())
  }
}
