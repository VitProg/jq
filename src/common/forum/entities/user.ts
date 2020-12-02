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

  private constructor () {
  }

  static create (userData?: IUser) {
    if (!userData) {
      return undefined
    }
    // noinspection TypeScriptValidateJSTypes
    return Object.assign(new User(), userData)
  }

  get avatarUrl () {
    return ForumConfiguration.avatarBaseUrl + this.avatar
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
