import { User } from '../../common/forum/models/user'
import { AppRoute } from '../routing/types'


export interface IRootStore {
  readonly uiStore: IUIStore
  readonly userStore: IUserStore
  readonly routeStore: IRouteStore
}

interface IBaseStore {
  readonly root: IRootStore
}

export interface IUIStore extends IBaseStore {
  readonly loading: boolean
  setLoading(value: boolean): void
}

export interface IUserStore extends IBaseStore {
  readonly user?: User
  readonly token?: string
  setUser(user: User, token?: string): void
  setToken(token?: string): void
  clearUser(): void
  readonly isAuth: boolean
}

export type StoredRoute = Omit<AppRoute, 'push' | 'replace'>

export interface IRouteStore extends IBaseStore {
  readonly history: StoredRoute[]

  readonly noModalRoute: StoredRoute | undefined
  readonly last: StoredRoute | undefined
  readonly current: StoredRoute | undefined
  readonly isModal: boolean

  readonly saved: StoredRoute | undefined

  push(route: StoredRoute): void
  replace(route: StoredRoute): void
  reload(): void
  back(): void

  setSaved(route: StoredRoute): void
  clearSaved(): void
  pushSaved(): void
  replaceSaved(): void
}
