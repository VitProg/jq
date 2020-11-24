import { BoardEntity, CategoryEntity, MemberEntity, MessageEntity, TopicEntity } from '../../entities'
import { Board, Category, Message, Topic, User } from '../../../common/forum/forum.entities'
import { AnyObject } from '../../../common/utils/object'
import { timestampToDate, toGender } from './transform'
import { MemberDisplayNameField, MemberEmailField, MemberLoginField } from '../constants'


function entityListToMap<E, O extends {id: number}>(
  entityList: E[],
  toObjectFunction: (entity: E, ...args: any[]) => O,
  ...args: any[]
): Map<number, O> {
  const map = new Map<number, O>()
  entityList.forEach(entity => {
    const obj = toObjectFunction(entity, ...args)
    map.set(obj.id >>> 0, obj)
  })
  return map
}


export function toUser(member: MemberEntity, withFields: Array<'email' | 'auth'> = []): User {
  const user: User = {
    id: member.idMember,
    login: member[MemberLoginField],
    displayName: member[MemberDisplayNameField],
    url: member.urlName,
    avatar: member.avatar,
    gender: toGender(member.gender),
    statistics: {
      posts: member.posts,
      karma: member.karma,
    }
  }

  if (withFields.includes('auth')) {
    user.auth = {
      passwordHash: member.passwd,
      salt: member.passwordSalt,
    }
  }

  if (withFields.includes('email')) {
    user.email = member[MemberEmailField]
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

