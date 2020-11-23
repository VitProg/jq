import { BoardEntity, CategoryEntity, MemberEntity, MessageEntity, TopicEntity } from '../../entities'
import { Board, Category, Message, Topic, User } from '../../../common/forum.entities'
import { timestampToDate } from './date'
import { AnyObject } from '../../common/utils/object'


function entityListToMap<E, O extends {id: number}>(
  entityList: E[],
  toObjectFunction: (entity: E, ...args: any[]) => O,
  ...args: any[]
): Record<number, O> {
  const map: AnyObject = {}
  entityList.forEach(entity => {
    const obj = toObjectFunction(entity, ...args)
    map[obj.id >>> 0] = obj
  })
  return map
}


export function toUser(member: MemberEntity, withFields: Array<'email' | 'auth'> = []): User {
  const user: User = {
    id: member.idMember,
    login: member.memberName,
    displayName: member.realName,
    url: member.urlName,
    avatar: member.avatar,
    statistics: {
      posts: member.posts,
      karma: member.karma,
    }
  }

  if (withFields.includes('auth')) {
    user.token = member.passwd
    // user.salt = member.passwordSalt
  }

  if (withFields.includes('email')) {
    user.email = member.emailAddress
  }

  return user
}


export const toUserMap = (memberEntityList: MemberEntity[], withFields: Array<'email' | 'auth'> = []) => entityListToMap(memberEntityList, toUser, withFields)


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



export function toTopic(topic: TopicEntity): Topic {
  return {
    id: topic.idTopic,
    // subject: topic.subject,
    url: topic.url,
    isSticky: topic.isSticky === 1,
    linksId: {
      board: topic.idBoard,
    },
  }
}

export const toTopicMap = (topicEntityList: TopicEntity[]) => entityListToMap(topicEntityList, toTopic)


export function toBoard(board: BoardEntity): Board {
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


export function toCategory(category: CategoryEntity): Category {
  return {
    id: category.idCat,
    name: category.name,
    order: category.catOrder,
  }
}

export const toCategoryMap = (categoryEntityList: CategoryEntity[]) => entityListToMap(categoryEntityList, toCategory)

