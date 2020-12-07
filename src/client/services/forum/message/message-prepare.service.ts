import { IMessagePrepareService, IMessageService } from '../types'
import { inject } from '../../../ioc/ioc.decoratos'
import { IApiService } from '../../types'
import { ApiServiceSymbol, MessageServiceSymbol } from '../../ioc.symbols'
import { store } from '../../../store'
import { ForumStoreType, MessageDataPageProps } from '../../../store/forum/types'
import { runInAction } from 'mobx'


export class MessagePrepareService implements IMessagePrepareService {
  @inject(MessageServiceSymbol) messageService!: IMessageService
  @inject(ApiServiceSymbol) api!: IApiService

  async prepareLatest ({ page }: { page: number }): Promise<void> {

    const props: Omit<MessageDataPageProps, 'meta'> = {
      type: 'latest',
    }
    const pageProps = { page, ...props }

    const status = store.forumStore.messageStore.getStatus('getPage', pageProps)
    if (status) {
      return
    }

    try {
      store.forumStore.messageStore.setStatus('getPage', pageProps, 'pending')

      console.log('Prepare data for', pageProps)

      const data = await this.messageService.latest({
        page,
        pageSize: store.configStore.forumMessagePageSize,
      })

      if (!data) {
        store.forumStore.messageStore.setStatus('getPage', pageProps, undefined)
        return
      }

      runInAction(() => {
        store.forumStore.messageStore.setPage({
          items: data.items,
          pageProps: {
            ...props,
            meta: data.meta,
          }
        })

        if (data?.relations) {
          for (const [type, items] of Object.entries(data.relations)) {
            const storeForType = store.forumStore.getStore(type as ForumStoreType)
            if (storeForType) {
              storeForType.setMany({
                items: items as any
              })
            }
          }
        }
      })

      store.forumStore.messageStore.setStatus('getPage', pageProps, 'loaded')
    } catch {
      store.forumStore.messageStore.setStatus('getPage', pageProps, 'error')
    }


  }


}
