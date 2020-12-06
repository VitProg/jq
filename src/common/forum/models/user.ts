import { IUser as IUser } from '../forum.interfaces'
import { Gender } from '../forum.constants'
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
