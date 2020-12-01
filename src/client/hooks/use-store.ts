import { IRootStore } from '../store/types'
import { store } from '../store'


export function useStore (): IRootStore {
  return store
}
