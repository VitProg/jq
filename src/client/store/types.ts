import { User } from '../../common/forum/entities/user'


export interface IRootStore {
  readonly uiStore: IUIStore
  readonly userStore: IUserStore
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
}
