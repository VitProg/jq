import { RootStore } from './root.store'
import { IRootStore } from './types'


const isDevelopment = process.env.NODE_ENV !== 'production'

// export const store: IRootStore = isDevelopment ? remotedev(new RootStore()) : new RootStore()
export const store: IRootStore = new RootStore()

if (isDevelopment) {
  (window as any)._store_ = store
}
