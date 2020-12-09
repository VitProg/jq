import { IUser as IUser, IUserGroup } from '../forum.interfaces'
import { Gender } from '../forum.constants'
import slug from 'slug'


export class User implements IUser {
  id: number = 0
  email?: string
  login: string = ''
  displayName: string = ''
  url: string = ''
  avatar: string = ''
  gender: Gender = Gender.Unknown
  dates: {
    lastLogin?: Date
    registered?: Date
  } = {}
  statistics: {
    posts: number
    karmaPlus: number
    karmaMinus: number
  } = {
    karmaMinus: 0,
    karmaPlus: 0,
    posts: 0,
  }
  settings: {
    timeOffset: number
    permissions?: string[]
    groupIds: number[]
    groups?: IUserGroup[]
  } = {
    timeOffset: 0,
    groupIds: [-1, 0],
  }
  auth?: {
    passwordHash?: string
    salt?: string
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
