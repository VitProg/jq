import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { MemberEntity } from '../entities/member.entity'
import { FindManyOptions, FindOperator, In, Repository } from 'typeorm'
import { toBoardMap, toMessage, toTopicMap, toUser, toUserMap } from './utils/mapper'
import { BoardEntity, MessageEntity, TopicEntity } from '../entities'
import { User } from './types'
import { listResponse } from '../common/response/ListResponse'

@Injectable()
export class ForumService {
  constructor (
    @InjectRepository(MemberEntity) private readonly memberRepository: Repository<MemberEntity>,
    @InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(TopicEntity) private readonly topicRepository: Repository<TopicEntity>,
    @InjectRepository(BoardEntity) private readonly boardRepository: Repository<BoardEntity>, // to permanent cache
  ) {
  }

  async getActiveUsers(limit = 10, offset = 0) {
    const findOptions: FindManyOptions<MemberEntity> = {
      where: {
        isSpammer: 0,
        posts: new FindOperator('moreThan', 0)
      },
      order: {
        lastLogin: 'DESC'
      },
      take: limit,
      skip: offset,
    }

    const [users, count] = await this.memberRepository.findAndCount(findOptions)

    return listResponse({
      entity: 'User',
      limit,
      offset,
      list: users.map(toUser),
    })
  }

  async getLastMessages(limit = 10, offset = 0) {
    const options: FindManyOptions<MessageEntity> = {
      order: {
        idMsg: 'DESC',
        updateTimestamp: 'DESC',
      },
      take: limit,
      skip: offset,
    }

    const messageEntityList = await this.messageRepository.find(options)
    const messages = (messageEntityList).map(toMessage)

    const userIdList = new Set(messages.map(message => message.linksId.user))
    const userMap = toUserMap(await this.memberRepository.findByIds([...userIdList]))

    const topicIdList = new Set(messages.map(messages => messages.linksId.topic))
    const topicMap = toTopicMap(await this.topicRepository.findByIds([...topicIdList]))

    const boardIdList = new Set(messages.map(messages => messages.linksId.board))
    const boardMap = toBoardMap(await this.boardRepository.findByIds([...boardIdList]))

    const list = messages.map(message => {
      const user = userMap[message.linksId.user]
      const topic = topicMap[message.linksId.topic]
      const board = boardMap[message.linksId.board]

      return ({
        ...message,
        user,
        topic,
        board,
      })
    })
    // console.log(list)
    return listResponse({
      entity: 'Message',
      limit,
      offset,
      list,
    })
  }
}
