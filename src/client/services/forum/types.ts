import { LastMessageRequest } from '../types'
import { ILatestMessageResponse } from '../../../common/responses/forum.responses'
import { CancelablePromiseType } from 'cancelable-promise'
import { ExtractItem, ExtractPageStoreDataEx, ForumCachedStoreType, ForumPagesStoreType, ForumStoreType, GetForumStore, IBoardStore, ICategoryStore, IMessageStore, ITopicStore } from '../../store/forum/types'
import { IMyStore, IRouteStore } from '../../store/types'


export interface IMessageService {
  latest (params: LastMessageRequest): CancelablePromiseType<ILatestMessageResponse | undefined>
}

export interface IForumService {
  preparePageData<
    DataType extends ForumPagesStoreType,
    PageStore extends GetForumStore<DataType>,
    Item extends ExtractItem<PageStore>,
    PageProps extends ExtractPageStoreDataEx<PageStore>
  >(
    props: {
      dataType: DataType,
      page: number,
    } & Omit<PageProps, 'meta'>
  ): Promise<void>

  prepareItemData<
    DataType extends ForumStoreType
  >(
    dataType: DataType,
    id: number,
  ): Promise<void>

  prepareAllData<
    DataType extends ForumCachedStoreType
  >(
    dataType: DataType,
  ): Promise<void>
}


