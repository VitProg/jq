import { IRootStore, IUIStore } from './types'


export class UIStore implements IUIStore {
  loading = false

  setLoading (value: boolean): void {
    this.loading = value
  }

  constructor (readonly root: IRootStore) {
    //
  }
}
