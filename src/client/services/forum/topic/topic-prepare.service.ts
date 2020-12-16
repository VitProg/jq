import { ITopicPrepareService, ITopicService } from '../types'
import { inject } from '../../../ioc/ioc.decoratos'
import { IApiService } from '../../types'
import { ApiServiceSymbol, TopicServiceSymbol } from '../../ioc.symbols'
import { store } from '../../../store'
import { TopicDataPageProps } from '../../../store/forum/types'
import { runInAction } from 'mobx'
import { StoredRoute } from '../../../store/types'
import { isRoute } from '../../../routing/utils'
import { mute } from '../../../../common/utils/promise'
import { ITopic } from '../../../../common/forum/forum.base.interfaces'
import { isArray } from '../../../../common/type-guards'


export class TopicPrepareService implements ITopicPrepareService {
  @inject(TopicServiceSymbol) topicService!: ITopicService
  @inject(ApiServiceSymbol) api!: IApiService

  processRoute (route: StoredRoute): boolean {
    if (isRoute(route, 'boardTopicList')) {
      const page = route.params.page ?? 1
      const board = route.params.board.id

      mute(this.preparePage({ type: 'board', board, page }))

      return true
    }

    return false
  }

  async preparePage (pageProps: { page: number } & Omit<TopicDataPageProps, 'meta'>): Promise<void> {
    if (pageProps.type === 'search') {
      // todo
      return
    }

    const { page, ...props } = pageProps

    const status = store.forumStore.topicStore.getStatus('getPage', pageProps)
    if (status) {
      return
    }

    try {
      store.forumStore.topicStore.setStatus('getPage', pageProps, 'pending')

      console.log('Prepare data for', pageProps)

      const data = await this.load(pageProps)

      if (!data) {
        store.forumStore.topicStore.setStatus('getPage', pageProps, undefined)
        return
      }

      runInAction(() => {
        store.forumStore.topicStore.setPage({
          items: data.items,
          pageProps: {
            ...props,
            meta: data.meta,
          }
        })

        // if (data?.relations) {
        //   for (const [type, items] of Object.entries(data.relations)) {
        //     const storeForType = store.forumStore.getStore(type as ForumStoreType)
        //     if (storeForType) {
        //       storeForType.setMany({
        //         items: items as any
        //       })
        //     }
        //   }
        // }

        store.forumStore.topicStore.setStatus('getPage', pageProps, 'loaded')
      })
    } catch {
      runInAction(() => {
        store.forumStore.topicStore.setStatus('getPage', pageProps, 'error')
      })
    }
  }

  async prepareAndGet<N extends number | number[]> (id: N): Promise<(N extends number ? ITopic : ITopic[]) | undefined> {
    const isSingle = !isArray(id)
    const ids = (isArray(id) ? id : [id]).sort() as number[]


    const fromStore = store.forumStore.topicStore.getMany(ids, false)

    if (fromStore && fromStore.length > 0) {
      return (isSingle ? fromStore[0] : fromStore) as any
    }

    try {
      store.forumStore.topicStore.setStatus('getMany', ids, 'pending')

      const items = await this.topicService.byIds(ids)

      if (!items) {
        store.forumStore.topicStore.setStatus('getMany', ids, undefined)
        return
      }

      store.forumStore.topicStore.setMany({ items })

      store.forumStore.topicStore.setStatus('getMany', ids, 'loaded')

      return (isSingle ? items[0] : items) as any
    } catch {
      runInAction(() => {
        store.forumStore.topicStore.setStatus('getMany', ids, 'error')
      })
    }
  }


  private async load (pageProps: { page: number } & Omit<TopicDataPageProps, 'meta'>) {
    switch (pageProps.type) {
      case 'board':
        if (!pageProps.board) {
          throw new Error('TopicPrepareService: board is empty')
        }

        return this.topicService.byBoard({
          page: pageProps.page,
          board: pageProps.board,
          pageSize: store.configStore.forumTopicPageSize,
        })
      case 'user':
      // todo
      // if (!pageProps.user) {
      //   throw new Error('TopicPrepareService: user is empty')
      // }
      //
      // /// todo add UserPrepareService
      //
      // return this.topicService.byUser({
      //   page: pageProps.page,
      //   user: pageProps.user,
      //   pageSize: store.configStore.forumTopicPageSize,
      // })
    }
  }

}
