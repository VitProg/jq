import { makeAutoObservable, makeObservable } from 'mobx'
import { IRootStore, IUIStore, IUserStore } from './types'
import { UIStore } from './ui.store'
import { UserStore } from './user.store'

export class RootStore implements IRootStore {
  readonly uiStore: IUIStore
  readonly userStore: IUserStore

  constructor () {
    this.uiStore = new UIStore(this)
    this.userStore = new UserStore(this)

    makeAutoObservable(this, {
      // todo
    })
  }
}
