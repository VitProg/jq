import { makeAutoObservable, makeObservable } from 'mobx'
import { IRootStore, IRouteStore, IUIStore, IUserStore } from './types'
import { UIStore } from './ui.store'
import { UserStore } from './user.store'
import { RouteStore } from './route.store'

export class RootStore implements IRootStore {
  readonly uiStore: IUIStore
  readonly userStore: IUserStore
  readonly routeStore: IRouteStore

  constructor () {
    this.uiStore = new UIStore(this)
    this.userStore = new UserStore(this)
    this.routeStore = new RouteStore(this)

    makeAutoObservable(this, {
      // todo
    })
  }
}
