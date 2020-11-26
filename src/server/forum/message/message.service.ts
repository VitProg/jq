import { Injectable } from '@nestjs/common'
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate'
import { MessageAllRelations, MessageRelations, MessageRelationsArray, MessageRelationsRecord } from '../../../common/forum/forum.entity-relations'
import { LastMessageResponse } from '../../../common/forum/forum.responses'
import { FindManyOptions, In, Not, Repository } from 'typeorm'
import { MessageEntity } from '../../entities'
import { BoardsIgnored } from '../constants'
import { toMessage } from '../utils/mapper'
import { InjectRepository } from '@nestjs/typeorm'
import { UserService } from '../../user/user.service'
import { BoardService } from '../board/board.service'
import { TopicService } from '../topic/topic.service'


@Injectable()
export class MessageService {

  constructor (
    @InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>,
    private userService: UserService,
    private boardService: BoardService,
    private topicService: TopicService,
  ) {
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

    const relations = {} as MessageRelationsRecord

    if (withRelations.includes(MessageRelations.user)) {
      const userIds = new Set(messages.map(message => message.linksId.user))
      relations[MessageRelations.user] = await this.userService.findByIdsToRecord(userIds)
    }

    if (withRelations.includes(MessageRelations.topic)) {
      const topicIds = new Set(messages.map(messages => messages.linksId.topic))
      relations[MessageRelations.topic] = await this.topicService.findByIdsToRecord(topicIds)
    }

    if (withRelations.includes(MessageRelations.board)) {
      const boardIds = new Set(messages.map(messages => messages.linksId.board))
      relations[MessageRelations.board] = await this.boardService.findByIdsToRecord(boardIds)
    }

    return {
      ...data,
      items: messages,
      relations,
    }
  }

}
