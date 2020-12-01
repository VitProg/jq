import { RootStore } from './root.store'


export const store = new RootStore()

const isDevelopment = process.env.NODE_ENV !== 'production'
if (isDevelopment) {
  (window as any)._store_ = store
}
