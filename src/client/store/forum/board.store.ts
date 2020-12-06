import {
  DataStoreSetData,
  DataStoreSetManyData,
  ExtractDataItem,
  ExtractItem,
  ExtractPageProps,
  IBoardStore,
  IForumStore
} from './types'
import { action, makeObservable, observable, reaction, runInAction } from 'mobx'
import {
  dataStoreDeserializeItems,
  dataStoreFlush,
  dataStoreGet,
  dataStoreGetMany,
  dataStoreSerializeItems,
  dataStoreSet,
  dataStoreSetMany
} from './utils'


type Store = BoardStore
type StoreType = 'board'
type PageProps = ExtractPageProps<StoreType>
type DataItem = ExtractDataItem<StoreType>
type Item = ExtractItem<StoreType>

const LOCAL_STORAGE_KEY = 'js-board-storage'

export class BoardStore implements IBoardStore {
  constructor (public forumStore: IForumStore) {
    makeObservable(this,)

    reaction(
      () => this.items,
      () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, dataStoreSerializeItems(this))
      },
      {
        delay: 250
      }
    )

    const items = dataStoreDeserializeItems(this, localStorage.getItem(LOCAL_STORAGE_KEY))
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    if (items) {
      runInAction(() => {
        this.items = items
      })
    }
  }

  readonly defaultExpireIn: number = 60 * 60 // 1 hour
  readonly maxStoredItems: number = 200

  @observable.deep items: Map<number, DataItem> = new Map()

  @action.bound
  flush (): void {
    dataStoreFlush(this)
  }

  @action.bound
  set (data: DataStoreSetData<Item>): void {
    dataStoreSet(this, data)
  }

  @action.bound
  setMany (data: DataStoreSetManyData<Item>): void {
    dataStoreSetMany(this, data)
  }

  get (id: number): Item | undefined {
    return dataStoreGet(this, id)
  }

  getMany<AsRecord extends true | false = false> (
    idList: number[],
    asRecord?: AsRecord,
  ): undefined | (AsRecord extends true ? Record<number, Item> : Item[]) {
    return dataStoreGetMany(this, idList, asRecord)
  }
}
