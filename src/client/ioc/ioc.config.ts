import { container } from './ioc.container'
import { IApiService } from '../services/interfaces'
import { ApiServiceSymbol } from './ioc.symbols'
import { ApiService } from '../services/api.service'
import { IRootStore } from '../store/types'
import { RootStore } from '../store/root.store'

container.bind<IApiService>(ApiServiceSymbol).to(ApiService)
// container.bind<IRootStore>(RootStoreSymbol).to(RootStore)
