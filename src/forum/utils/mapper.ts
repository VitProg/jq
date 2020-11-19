import { BoardEntity, MemberEntity, MessageEntity, TopicEntity } from '../../entities'
import { Message, User } from '../types'
import { timestampToDate } from './date'


function entityListToMap<E, O extends {id: number}>(
  entityList: E[],
  toObjectFunction: (entity: E) => O
): Record<number, O> {
  const map = {}
  entityList.forEach(entity => {
    const obj = toObjectFunction(entity)
    map[obj.id >>> 0] = obj
  })
  return map
}


export function toUser(member: MemberEntity): User {
  return {
    id: member.idMember,
    email: member.emailAddress,
    login: member.memberName,
    displayName: member.realName,
    url: member.urlName,
    statistics: {
      posts: member.posts,
      karma: member.karma,
    }
  }
}


export const toUserMap = (memberEntityList: MemberEntity[]) => entityListToMap(memberEntityList, toUser)


export function toMessage(message: MessageEntity): Message {
  return {
    id: message.idMsg,
    linksId: {
      user: message.idMember,
      topic: message.idTopic,
      board: message.idBoard,
    },
    body: message.body,
    createdAt: timestampToDate(message.posterTime),
    updatedAt: timestampToDate(message.modifiedTime),
  }
}

export const toMessageMap = (messageEntityList: MessageEntity[]) => entityListToMap(messageEntityList, toMessage)



export function toTopic(topic: TopicEntity) {
  return {
    id: topic.idTopic,
    // subject: topic.subject,
    url: topic.url,
    isSticky: topic.isSticky,
    linksId: {
      board: topic.idBoard,
    },
  }
}

export const toTopicMap = (topicEntityList: TopicEntity[]) => entityListToMap(topicEntityList, toTopic)


export function toBoard(board: BoardEntity) {
  return {
    id: board.idBoard,
    name: board.name,
    description: board.description,
    url: board.url,
    linksId: {
      category: board.idCat,
    },
  }
}

export const toBoardMap = (boardEntityList: BoardEntity[]) => entityListToMap(boardEntityList, toBoard)

