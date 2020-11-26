import { IRootStore } from '../mobx/store/types'
import { useInjection } from '../ioc/ioc.react'
import { RootStoreSymbol } from '../ioc/ioc.symbols'


export function useStore(): IRootStore {
  return useInjection<IRootStore>(RootStoreSymbol)
}
