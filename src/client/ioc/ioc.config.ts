import { container } from './ioc.container'
import { IApiService } from '../services/interfaces'
import { ApiServiceSymbol, RootStoreSymbol } from './ioc.symbols'
import { ApiService } from '../services/api.service'
import { IRootStore } from '../mobx/store/types'
import { RootStore } from '../mobx/store/root.store'

container.bind<IApiService>(ApiServiceSymbol).to(ApiService)
container.bind<IRootStore>(RootStoreSymbol).to(RootStore)
