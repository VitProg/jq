import { Injectable } from '@nestjs/common';
import { ForumCacheService } from '../../forum/forum-cache/forum-cache.service'
import { IUser, IUserGroup } from '../../../common/forum/forum.interfaces'
import { walkByAny } from '../../../common/utils/common'


@Injectable()
export class UserGroupService {

  constructor (
    private forumCacheService: ForumCacheService
  ) {
  }

  async getByUser (user: IUser): Promise<Array<Readonly<IUserGroup>>> {
    const userGroupMap = await this.forumCacheService.getUserGroupMap()
    return user.groupIds
      .map(id => userGroupMap.get(id))
      .filter(Boolean) as Array<Readonly<IUserGroup>>
  }

  userInGroups(user: IUser, ...groupIds: number[]) {
    return groupIds.every(g => user.groupIds.includes(g))
  }

  /**
   * mutable!
   * @param users
   */
  async fillForUsers<IN extends Map<number, IUser> | Record<number, IUser> | IUser[]>(users: IN): Promise<IN> {
    for (let user of walkByAny(users)) {
      user.groups = await this.getByUser(user)
    }

    return users
  }
}
