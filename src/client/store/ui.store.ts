import { IRootStore, IUIStore } from './types'
import { makeAutoObservable } from 'mobx'


export class UIStore implements IUIStore {
  constructor (readonly root: IRootStore) {
    makeAutoObservable(this, {
      root: false
    })
  }

  loading = false

  setLoading (value: boolean): void {
    this.loading = value
  }

}
