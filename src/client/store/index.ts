import { RootStore } from './root.store'
import { IRootStore, IRouteStore } from './types'


export const store: IRootStore = new RootStore()

const isDevelopment = process.env.NODE_ENV !== 'production'
if (isDevelopment) {
  (window as any)._store_ = store
}
