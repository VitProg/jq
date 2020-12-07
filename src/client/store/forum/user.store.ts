import {
  DataStorePagesGetMethods,
  DataStorePagesGetPageData, DataStorePagesGetPageMetaData,
  DataStorePagesSetData,
  DataStorePagesSetManyData,
  DataStorePagesSetPageData,
  ExtractDataItem,
  ExtractItem,
  ExtractPageProps,
  Hash,
  IForumStore,
  IUserStore, RequestStatus
} from './types'
import { action, makeObservable, observable } from 'mobx'
import {
  dataStoreClear,
  dataStoreFlush,
  dataStoreGet, dataStoreGetAll,
  dataStoreGetMany, dataStoreGetStatus,
  dataStorePagerGetPage, dataStorePagerGetPageMeta,
  dataStorePagesSet,
  dataStorePagesSetMany, dataStoreSetStatus
} from './utils'
import { IPaginationMeta } from 'nestjs-typeorm-paginate'
import { GetFirstArgumentType } from '../../../common/utils/types'


type Store = UserStore
type StoreType = 'user'
type PageProps = ExtractPageProps<StoreType>
type DataItem = ExtractDataItem<StoreType>
type Item = ExtractItem<StoreType>


export class UserStore implements IUserStore {
  constructor (public forumStore: IForumStore) {
    makeObservable(this)
  }

  readonly name = 'user' as const
  readonly defaultExpireIn: number = 5 * 60 // 5 minutes
  readonly maxStoredItems: number = 500

  @observable.deep readonly items: Map<number, DataItem> = new Map()
  @observable.deep pages: Record<Hash, PageProps> = {}
  @observable statuses: Map<string, RequestStatus> = new Map<string, RequestStatus>()

  @action
  flush (): void {
    dataStoreFlush(this)
  }

  @action.bound
  clear (): void {
    dataStoreClear(this)
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

  getAll <AsRecord extends true | false = false>(
    asRecord: AsRecord,
  ): AsRecord extends true ? Record<number, Item> : Item[] {
    return dataStoreGetAll(this, asRecord)
  }

  getPage (data: DataStorePagesGetPageData<PageProps>): { items: Item[], meta: IPaginationMeta } | undefined {
    return dataStorePagerGetPage(this, data)
  }

  getPageMeta (data: DataStorePagesGetPageMetaData<PageProps>): Omit<IPaginationMeta, 'currentPage'> | undefined {
    return dataStorePagerGetPageMeta(this, data)
  }

  setPage (data: DataStorePagesSetPageData<PageProps, Item>): void {
    this.setMany(data)
  }

  getStatus <M extends DataStorePagesGetMethods>(type: M, props: GetFirstArgumentType<Store[M]>): RequestStatus | undefined {
    return dataStoreGetStatus(this, type, props)
  }

  setStatus <M extends DataStorePagesGetMethods>(type: M, props: GetFirstArgumentType<Store[M]>, status: RequestStatus | undefined): void {
    dataStoreSetStatus(this, type, props, status)
  }
}
