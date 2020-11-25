import { IUser as IUser } from '../forum.interfaces'
import { ForumConfiguration, Gender } from '../forum.constants'
import { ObjectID } from 'typeorm'


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

  get link () {
    const pattern = ForumConfiguration.userLinkPattern
    return pattern
      .replace(/{id}/, this.id.toString())
      .replace(/{url}/, this.url)
  }
}
