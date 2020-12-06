import { User } from '../../common/forum/models/user'
import { AppRoute } from '../routing/types'
import { Theme } from '@material-ui/core'
import { IForumStore } from './forum/types'
import { IUser } from '../../common/forum/forum.interfaces'


export interface IRootStore {
  readonly uiStore: IUIStore
  readonly seoStore: ISeoStore
  readonly myStore: IMyStore
  readonly routeStore: IRouteStore
  readonly forumStore: IForumStore
  readonly configStore: IConfigStore
}

export interface IConfigStore {
  readonly isDevelopment: boolean
  readonly forumAvatarBaseUrl: string
  readonly forumGalleryBaseUrl: string
  readonly forumAttachmentsBaseUrl: string
  readonly seoBaseTitle: string | undefined
  readonly seoBaseDescription: string | undefined
  readonly seoBaseKeywords: string[]

  readonly forumMessagePageSize: number
  readonly forumTopicPageSize: number
  readonly forumUserPageSize: number

  getUserAvatarUrl(user: IUser): string | undefined
}

export interface IUIStore {
  readonly loading: boolean
  readonly theme: Theme
  readonly darkMode: boolean
  setDarkMode(value: boolean): void
  setLoading(value: boolean): void
}

export interface IMyStore {
  readonly user?: User
  readonly token?: string
  setUser(user: User, token?: string): void
  setToken(token?: string): void
  clearUser(): void
  readonly isAuth: boolean
}

export type StoredRoute = Omit<AppRoute, 'push' | 'replace'>

export interface IRouteStore {
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

export interface ISeoStore {
  readonly configStore: IConfigStore

  setBase(data: {title?: string, keywords?: string[], description?: string}): void

  setTitle(...titles: (string | undefined | null)[]): void
  addTitle(...titles: (string | undefined | null)[]): void
  setKeywords(...keywords: (string | undefined | null)[]): void
  addKeyword(...keywords: (string | undefined | null)[]): void
  setDescription(description: string | undefined | null): void

  setPageSeo(data: {title?: string[], keywords?: string[], description?: string}): void

  clear(): void
}
