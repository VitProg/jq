import { IForumService, IMessageService } from './types'
import {
  ExtractItem,
  ExtractPageStoreDataEx,
  ForumCachedStoreType,
  ForumPagesStoreType,
  ForumStoreType,
  GetForumStore
} from '../../store/forum/types'
import { inject } from '../../ioc/ioc.decoratos'
import { MessageServiceSymbol } from '../ioc.symbols'
import { store } from '../../store'
import { makeAutoObservable, reaction } from 'mobx'
import { mute } from '../../../common/utils/promise'
import { dataStoreGetPageHash, IsMessageDataPageProps } from '../../store/forum/utils'
import { isRoute } from '../../routing/utils'


export class ForumService implements IForumService {
  @inject(MessageServiceSymbol) messageService!: IMessageService

  //todo add other services

  constructor () {
    makeAutoObservable(this, {
      messageService: false,
      //todo
    })

    reaction(
      () => [
        store.routeStore.current,
        store.routeStore.noModalRoute,
      ],
      () => {
        const route = store.routeStore.noModalRoute ?? store.routeStore.current

        if (isRoute(route, 'lastMessages')) {
          mute(this.preparePageData({
            dataType: 'message',
            page: route.params.page ?? 1,
            type: 'latest',
          }))
        }

      }, {
        fireImmediately: true
      })
  }

  async preparePageData<DataType extends ForumPagesStoreType,
    PageStore extends GetForumStore<DataType>,
    Item extends ExtractItem<PageStore>,
    PageProps extends ExtractPageStoreDataEx<PageStore>> (
    props: {
      dataType: DataType,
      page: number,
    } & Omit<PageProps, 'meta'>
  ): Promise<void> {
    //todo
    const pageHash = dataStoreGetPageHash(props.page, props)
    if (props.dataType === 'message' && IsMessageDataPageProps(props)) {
      const storedData = store.forumStore.messageStore.getPage(props)
      if (storedData) {
        return
      }

      console.log('Prepare data for', pageHash)

      const data = await this.messageService.latest({
        page: props.page,
        pageSize: store.configStore.forumMessagePageSize,
        relations: ['topic', 'user']
      })

      if (!data) {
        return
      }

      store.forumStore.messageStore.setPage({
        items: data.items,
        pageProps: {
          ...props,
          meta: data.meta,
        }
      })

      if (data?.relations?.topic) {
        store.forumStore.topicStore.setMany({
          items: data.relations.topic,
        })
      }

      if (data?.relations?.user) {
        store.forumStore.userStore.setMany({
          items: data.relations.user,
        })
      }

      return
    }
  }

  async prepareItemData<DataType extends ForumStoreType> (
    dataType: DataType,
    id: number,
  ): Promise<void> {
    //todo
  }

  async prepareAllData<DataType extends ForumCachedStoreType> (
    dataType: DataType,
  ): Promise<void> {
    //todo
  }
}
