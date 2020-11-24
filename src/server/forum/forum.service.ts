import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, FindOperator, In, Not, Repository } from 'typeorm'
import { toMessage, toTopicMap, toUser, toUserMap } from './utils/mapper'
import { MemberEntity, MessageEntity, TopicEntity } from '../entities'
import { CacheService } from './cache/cache.service'
import { pick } from '../../common/utils/object'
import { IPaginationOptions, paginate, } from 'nestjs-typeorm-paginate'
import { ActiveUsersResponse, LastMessageResponse } from '../../common/forum/forum.responses'
import { MessageAllRelations, MessageRelations, MessageRelationsArray, MessageRelationsTypes } from '../../common/forum/forum.entity-relations'
import { BoardsIgnored } from './constants'


@Injectable()
export class ForumService {
  constructor (
    @InjectRepository(MemberEntity) private readonly memberRepository: Repository<MemberEntity>,
    @InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(TopicEntity) private readonly topicRepository: Repository<TopicEntity>,
    private readonly cacheService: CacheService,
  ) {
  }

  async getActiveUsers (options: IPaginationOptions): Promise<ActiveUsersResponse> {
    const findOptions: FindManyOptions<MemberEntity> = {
      where: {
        isSpammer: 0,
        posts: new FindOperator('moreThan', 0)
      },
      order: {
        posts: 'DESC',
        lastLogin: 'DESC'
      },
    }

    const data = await paginate(this.memberRepository, options, findOptions)

    return {
      ...data,
      items: data.items.map(m => toUser(m)),
    }
  }

  async getLastMessages (
    options: IPaginationOptions,
    withRelations: MessageRelationsArray = MessageAllRelations
  ): Promise<LastMessageResponse> {
    const findOptions: FindManyOptions<MessageEntity> = {
      order: {
        idMsg: 'DESC',
        updateTimestamp: 'DESC',
      },
      where: {
        idBoard: Not(In(BoardsIgnored)),
        approved: 1,
      }
    }

    const data = await paginate(this.messageRepository, options, findOptions)

    const messages = (data.items).map(toMessage)

    const relations = {} as MessageRelationsTypes

    if (withRelations.includes(MessageRelations.user)) {
      const userIdList = new Set(messages.map(message => message.linksId.user))
      relations[MessageRelations.user] = toUserMap(await this.memberRepository.findByIds([...userIdList]))
    }

    if (withRelations.includes(MessageRelations.topic)) {
      const topicIdList = new Set(messages.map(messages => messages.linksId.topic))
      relations[MessageRelations.topic] = toTopicMap(await this.topicRepository.findByIds([...topicIdList]))
    }

    if (withRelations.includes(MessageRelations.board)) {
      const boardIdList = new Set(messages.map(messages => messages.linksId.board.toString()))
      relations[MessageRelations.board] = pick(this.cacheService.boardMap, ...boardIdList)
    }

    return {
      ...data,
      items: messages,
      relations,
    }
  }
}
