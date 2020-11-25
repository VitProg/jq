import { makeObservable } from 'mobx'
import { IRootStore, IUIStore } from './types'
import { UIStore } from './ui.store'

export class RootStore implements IRootStore {
  readonly ui: IUIStore

  constructor () {
    this.ui = new UIStore(this)

    makeObservable(this, {
      // todo
    })
  }
}
