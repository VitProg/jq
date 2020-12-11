import { inject } from '../../../ioc/ioc.decoratos'
import { ApiServiceSymbol } from '../../ioc.symbols'
import { IApiService } from '../../types'
import { makeAutoObservable } from 'mobx'
import { IUser } from '../../../../common/forum/forum.interfaces'
import { uniqueArray } from '../../../../common/utils/array'


export class UserService {
  @inject(ApiServiceSymbol) api!: IApiService

  constructor () {
    makeAutoObservable(this)
  }

  async page (request: any) {
    // todo
    return []
  }

  async byId (id: number) {
    try {
      return await this.api
        .get<IUser | undefined>(`user/${id}`)
    } catch {
      return undefined
    }
  }

  async byIds (ids: number[]) {
    if (ids.length === 0) {
      return [] as IUser[]
    }

    if (ids.length === 1) {
      const item = await this.byId(ids[0])
      return item ? [item] : []
    }

    try {
      const items = await this.api
        .get<IUser[]>(`user/many/${uniqueArray(ids).join('|')}`)
      return items ?? []
    } catch {
      return [] as IUser[]
    }
  }

  async byName (name: string): Promise<IUser | undefined> {
    try {
      const users = await this.api
        .post<IUser[] | undefined>(`user/by-name`, {
          json: { name }
        })

      return users ? users.pop() : undefined
    } catch {
      return undefined
    }
  }
}
