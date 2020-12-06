import {
  DataStorePagesGetPageData,
  DataStorePagesSetData,
  DataStorePagesSetManyData,
  DataStorePagesSetPageData,
  ExtractDataItem,
  ExtractItem,
  ExtractPageProps,
  Hash,
  IForumStore,
  ITopicStore
} from './types'
import { action, makeObservable, observable } from 'mobx'
import {
  dataStoreFlush,
  dataStoreGet,
  dataStoreGetMany,
  dataStorePagerGetPage,
  dataStorePagesSet,
  dataStorePagesSetMany
} from './utils'
import { IPaginationMeta } from 'nestjs-typeorm-paginate'


type Store = TopicStore
type StoreType = 'topic'
type PageProps = ExtractPageProps<StoreType>
type DataItem = ExtractDataItem<StoreType>
type Item = ExtractItem<StoreType>


export class TopicStore implements ITopicStore {
  constructor (public forumStore: IForumStore) {
    makeObservable(this)
  }

  readonly defaultExpireIn: number = 5 * 60 // 5 minutes
  readonly maxStoredItems: number = 100

  @observable.deep readonly items: Map<number, DataItem> = new Map()
  @observable.deep pages: Record<Hash, PageProps> = {}

  @action
  flush (): void {
    dataStoreFlush(this)
  }

  @action.bound
  set (data: DataStorePagesSetData<PageProps, Item>): void {
    dataStorePagesSet(this, data)
  }

  setMany (data: DataStorePagesSetManyData<PageProps, Item>): void {
    dataStorePagesSetMany(this, data)
  }

  get (id: number): Item | undefined {
    return dataStoreGet(this, id)
  }

  getMany<AsRecord extends true | false = false> (
    idList: number[],
    asRecord: AsRecord,
  ): undefined | (AsRecord extends true ? Record<number, Item> : Item[]) {
    return dataStoreGetMany(this, idList, asRecord)
  }

  getPage (data: DataStorePagesGetPageData<PageProps>): { items: Item[], meta: IPaginationMeta } | undefined {
    return dataStorePagerGetPage(this, data)
  }

  setPage (data: DataStorePagesSetPageData<PageProps, Item>): void {
    this.setMany(data)
  }

}
