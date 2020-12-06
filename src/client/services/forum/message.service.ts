import { makeAutoObservable } from 'mobx'
import { IMessageService } from './types'
import { inject } from '../../ioc/ioc.decoratos'
import { IApiService, LastMessageRequest } from '../types'
import { ILatestMessageResponse } from '../../../common/responses/forum.responses'
import { asCancelablePromise } from '../utils'
import { ApiServiceSymbol } from '../ioc.symbols'

const LATEST_MAX_PAGES = 10
const LATEST_PAGE_SIZE = 10

export class MessageService implements IMessageService {
  @inject(ApiServiceSymbol) api!: IApiService

  constructor () {
    makeAutoObservable(this)
  }

  latest (params: LastMessageRequest) {
    const searchParams: typeof params = {
      pageSize: LATEST_PAGE_SIZE,
      relations: ['board', 'user', 'topic'],
      ...params
    }

    return asCancelablePromise(
      this.api
        .get<ILatestMessageResponse>(
          'message/latest',
          {
            searchParams,
            reformat: (data) => {
              data.meta.currentPage = data.meta.currentPage >>> 0
              data.meta.totalItems = Math.min(LATEST_MAX_PAGES * data.meta.itemsPerPage, data.meta.totalItems)
              data.meta.totalPages = Math.min(LATEST_MAX_PAGES, data.meta.totalPages)
            },
            cancelable: true,
          })
    )
  }


}
