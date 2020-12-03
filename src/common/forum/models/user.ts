import { IUser as IUser, IUserGroup } from '../forum.interfaces'
import { ForumConfiguration, Gender } from '../forum.constants'
import { ObjectID } from 'typeorm'
import slug from 'slug'


export class User implements IUser {
  id!: number
  email?: string
  login!: string
  displayName!: string
  url!: string
  avatar!: string
  gender!: Gender
  statistics!: {
    posts: number
    karma: number
  }
  // permissions?: string[]
  // groups?: IUserGroup[]
  groupIds!: number[]
  lastLogin?: Date

  get avatarUrl () {
    return this.avatar ? ForumConfiguration.avatarBaseUrl + this.avatar : undefined
  }

  get name () {
    return this.displayName ?? this.login
  }

  get slug () {
    if (this.url) {
      return this.url
    }
    return slug(this.displayName, {
      lower: true,
    })
  }
}
