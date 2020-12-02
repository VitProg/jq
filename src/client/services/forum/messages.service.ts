import { makeAutoObservable } from 'mobx'
import { IMessagesService } from './types'
import { inject } from '../../ioc/ioc.decoratos'
import { IApiService, LastMessageRequest } from '../types'
import { LastMessageResponse } from '../../../common/responses/forum.responses'
import { asCancelablePromise } from '../utils'
import { ApiServiceSymbol } from '../ioc.symbols'


export class MessagesService implements IMessagesService {
  @inject(ApiServiceSymbol) api!: IApiService

  constructor () {
    makeAutoObservable(this)
  }

  latest (params: LastMessageRequest) {
    return asCancelablePromise(
      this.api
        .get<LastMessageResponse>(
          'last-messages',
          {
            searchParams: params,
            reformat: data => data.meta.currentPage = data.meta.currentPage >>> 0,
            cancelable: true,
          })
    )
  }


}
