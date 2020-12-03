import { BoardEntity, CategoryEntity, MemberEntity, MemberGroupEntity, MessageEntity, PermissionEntity, TopicEntity } from '../../../entities'
import { IBoard, ICategory, IMessage, IPermission, ITopic, IUser, IUserGroup } from '../../../../common/forum/forum.interfaces'
import { timestampToDate, toGender } from './transform'
import { MemberDisplayNameField, MemberEmailField, MemberLoginField } from '../constants'
import { isNumber } from '../../../../common/type-guards'
import { WithFields } from '../../user/types'


function entityListToMap<E, O extends { id: number }> (
  entityList: E[],
  toObjectFunction?: (entity: E, ...args: any[]) => O,
  ...args: any[]
): Map<number, O> {
  const map = new Map<number, O>()
  entityList.forEach(entity => {
    const obj = toObjectFunction ?
      toObjectFunction(entity, ...args) :
      entity as any
    map.set(obj.id >>> 0, obj)
  })
  return map
}

export const toMap = <E extends { id: number }> (list: E[]) => entityListToMap<E, E>(list)


export function toUser (member: MemberEntity, withFields: WithFields = []): IUser {
  const groupIds: Set<number> = new Set<number>()

  if (member.idGroup > 0) {
    groupIds.add(member.idGroup)
  }
  const addGroups = member.additionalGroups.split(',').map(parseInt).filter(isNumber)
  for (const addGroup of addGroups) {
    groupIds.add(addGroup)
  }

  const user: IUser = {
    id: member.idMember,
    login: member[MemberLoginField],
    displayName: member[MemberDisplayNameField],
    url: member.urlName,
    avatar: member.avatar,
    gender: toGender(member.gender),
    lastLogin: member.lastLogin ? new Date(member.lastLogin * 1000) : undefined,
    groupIds: [...groupIds.values()],
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


export const toUserMap = (memberEntityList: MemberEntity[], withFields: WithFields = []) => entityListToMap(memberEntityList, toUser, withFields)


export function toMessage (message: MessageEntity): IMessage {
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


export function toTopic (topic: TopicEntity & { subject?: string }): ITopic {
  return {
    id: topic.idTopic,
    // subject: topic.subject,
    url: topic.url,
    isSticky: topic.isSticky === 1,
    subject: topic.subject ?? `topic-${topic.idTopic}`,
    linksId: {
      board: topic.idBoard,
    },
  }
}

export const toTopicMap = (topicEntityList: TopicEntity[]) => entityListToMap(topicEntityList, toTopic)


export function toBoard (board: BoardEntity): IBoard {
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


export function toCategory (category: CategoryEntity): ICategory {
  return {
    id: category.idCat,
    name: category.name,
    order: category.catOrder,
  }
}

export const toCategoryMap = (categoryEntityList: CategoryEntity[]) => entityListToMap(categoryEntityList, toCategory)


export function toUserGroup (group: MemberGroupEntity): IUserGroup {
  const result: IUserGroup = {
    id: group.idGroup,
    name: group.groupName,
  }

  if (group.onlineColor) {
    result.color = group.onlineColor
  }

  if (group.maxMessages > 0) {
    result.maxMessages = group.maxMessages
  }

  if (group.minPosts >= 0) {
    result.minPosts = group.minPosts
  }

  return result
}

export const toUserGroupMap = (groupEntityList: MemberGroupEntity[]) => entityListToMap(groupEntityList, toUserGroup)

export function toPermission (permission: PermissionEntity): IPermission {
  return {
    name: permission.permission,
    groupId: permission.idGroup,
  }
}

type ITEM<WO extends true | false> = WO extends true ? IPermission : string
type RET<WO extends true | false> = Map<number, Array<ITEM<WO>>>

export const toPermissionByGroupsMap =
  <WO extends true | false> (
    permissionEntityList: PermissionEntity[],
    withPermissionObject: WO
  ): RET<WO> => {
    const map: RET<WO> = new Map<number, Array<ITEM<WO>>>()

    for (const permissionEntity of permissionEntityList) {
      const permission = withPermissionObject ?
        toPermission(permissionEntity) :
        permissionEntity.permission
      const array: Array<ITEM<WO>> = []

      if (map.has(permissionEntity.idGroup)) {
        array.push(...map.get(permissionEntity.idGroup)!)
      }
      array.push(permission as ITEM<WO>)
      map.set(permissionEntity.idGroup, array)
    }
    return map
  }
