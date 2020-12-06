import { makeAutoObservable, makeObservable } from 'mobx'
import { IRootStore, IRouteStore, ISeoStore, IUIStore, IMyStore, IConfigStore } from './types'
import { UIStore } from './ui.store'
import { MyStore } from './my.store'
import { RouteStore } from './route.store'
import { SeoStore } from './seo.store'
import { ForumStore } from './forum/forum.store'
import { IForumStore } from './forum/types'
import { ConfigStore } from './config.store'

export class RootStore implements IRootStore {
  readonly configStore: IConfigStore
  readonly uiStore: IUIStore
  readonly seoStore: ISeoStore
  readonly myStore: IMyStore
  readonly routeStore: IRouteStore
  readonly forumStore: IForumStore

  constructor () {
    this.configStore = new ConfigStore()
    this.uiStore = new UIStore()
    this.seoStore = new SeoStore(this.configStore)
    this.myStore = new MyStore()
    this.routeStore = new RouteStore()
    this.forumStore = new ForumStore(this.routeStore, this.uiStore)

    makeAutoObservable(this, {
      // todo
    })
  }
}
