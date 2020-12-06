import { isArray, isObject } from '../../../common/type-guards'
import {
  BoardRelationsMap,
  DataItem,
  DataStore,
  DataStorePages,
  DataStorePagesGetPageData,
  DataStorePagesSetData,
  DataStorePagesSetManyData,
  DataStoreSetData,
  DataStoreSetManyData,
  ForumStoreType,
  Hash,
  MessageDataPageProps,
  MessageRelationsMap,
  Model,
  RelationsMap,
  TopicRelationsMap
} from './types'
import { AnyObject, omit } from '../../../common/utils/object'
import { runInAction, transaction } from 'mobx'
import { IPaginationMeta } from 'nestjs-typeorm-paginate'


export const IsMessageDataPageProps = (val: any): val is MessageDataPageProps =>
  isObject(val) && 'type' in val


export const getBlankRelationsMap = <DataType extends ForumStoreType> (dataType: DataType): RelationsMap<DataType> => {
  if (dataType === 'message') {
    return ({
      user: {},
      topic: {},
      board: {},
    } as MessageRelationsMap) as RelationsMap<DataType>
  }

  if (dataType === 'topic') {
    return ({
      board: {},
    } as TopicRelationsMap) as RelationsMap<DataType>
  }

  if (dataType === 'board') {
    return ({
      category: {},
    } as BoardRelationsMap) as RelationsMap<DataType>
  }

  return {} as RelationsMap<DataType>
}

export const dataStoreFlush = (store: DataStore<any>) => {
  runInAction(() => {
    const now = Date.now()

    for (const [key, data] of store.items) {
      const expireIn = data.expireIn ?? store.defaultExpireIn ?? 0
      const expireAt = data.updatedAt + expireIn * 1000
      if (now > expireAt) {
        debugger
        store.items.delete(key)
      }
    }
  })
}

export const dataStoreSet = <Item extends Model,
  DS extends DataStore<Item>> (
  store: DS,
  data: DataStoreSetData<Item>,
  needFlush = true,
) => {
  runInAction(() => {
    if (needFlush) {
      store.flush()
    }

    const exist = store.items.get(data.item.id)

    if (exist) {
      store.items.set(data.item.id, {
        item: {
          ...exist.item,
          ...data.item,
        },
        expireIn: data.expireIn,
        updatedAt: Date.now(),
      })
    } else {
      store.items.set(data.item.id, {
        item: {
          ...data.item
        },
        updatedAt: Date.now(),
        expireIn: (data.expireIn ?? store.defaultExpireIn ?? 0) >>> 0,
      })
    }
  })
}

export const dataStoreSetMany = <Item extends Model,
  DS extends DataStore<Item>> (
  store: DS,
  data: DataStoreSetManyData<Item>,
) => {
  runInAction(() => {
    const items = isArray(data.items) ? data.items : Object.values(data.items)
    for (const item of items) {
      dataStoreSet(
        store,
        {
          item,
          expireIn: data.expireIn,
        },
        false,
      )
    }
  })
}

export const dataStorePagesSet = <DS extends DataStorePages<Item, PageProps>,
  Item extends Model,
  PageProps extends { meta: IPaginationMeta }> (
  store: DS,
  data: DataStorePagesSetData<PageProps, Item>,
  needFlush = true,
  _pageHash?: string,
) => {
  runInAction(() => {
    if (needFlush) {
      store.flush()
    }
    const exist = store.items.get(data.item.id)

    const savePages = !_pageHash

    const pageHash = _pageHash ?? (data.pageProps ? dataStoreGetPageHash(data.pageProps.meta.currentPage, data.pageProps) : undefined)

    if (exist) {
      store.items.set(data.item.id, {
        item: {
          ...exist.item,
          ...data.item,
        },
        expireIn: data.expireIn,
        updatedAt: Date.now(),
        hash: pageHash ? [...exist.hash, pageHash] : [...exist.hash]
      })
    } else {
      store.items.set(data.item.id, {
        item: {
          ...data.item
        },
        updatedAt: Date.now(),
        expireIn: (data.expireIn ?? store.defaultExpireIn ?? 0) >>> 0,
        hash: pageHash ? [pageHash] : []
      })
    }

    if (savePages) {
      const page = (pageHash ? store.pages[pageHash] : undefined) ?? data.pageProps

      if (page && pageHash) {
        store.pages = {
          ...store.pages,
          [pageHash]: page,
        }
      }
    }
  })
}

export const dataStorePagesSetMany = <DS extends DataStorePages<Item, PageProps>,
  Item extends Model,
  PageProps extends { meta: IPaginationMeta }> (
  store: DS,
  data: DataStorePagesSetManyData<PageProps, Item>,
  needFlush = true,
) => {
  //todo
  runInAction(() => {
    if (needFlush) {
      store.flush()
    }

    const pageHash = data.pageProps ? dataStoreGetPageHash(data.pageProps.meta.currentPage, data.pageProps) : undefined

    const items = isArray(data.items) ? data.items : Object.values(data.items)
    for (const item of items) {
      dataStorePagesSet(
        store,
        {
          item,
          expireIn: data.expireIn,
          pageProps: data.pageProps,
        },
        false,
        pageHash
      )
    }

    const page = (pageHash ? store.pages[pageHash] : undefined) ?? data.pageProps

    if (page && pageHash) {
      store.pages = {
        ...store.pages,
        [pageHash]: page,
      }
    }
  })
}


export const dataStoreGet = <DS extends DataStore<Item>, Item extends Model> (store: DS, id: number): Item | undefined => {
  return store.items.get(id)?.item
}

export const dataStoreGetMany = <DS extends DataStore<Item>, Item extends Model, AsRecord extends true | false = false> (
  store: DS,
  idList: number[],
  asRecord?: AsRecord,
): undefined | (AsRecord extends true ? Record<number, Item> : Item[]) => {
  if (asRecord) {
    const map: any = {}
    for (const id of idList) {
      const item = store.get(id)
      if (item) {
        map[id] = item
      }
    }
    return map
  } else {
    return idList.map(id => store.get(id)).filter(Boolean) as any
  }
}

export const dataStorePagerGetPage = <Item extends Model,
  PageProps extends { meta: IPaginationMeta }> (
  store: DataStorePages<Item, PageProps>,
  data: DataStorePagesGetPageData<PageProps>,
): { items: Item[], meta: IPaginationMeta } | undefined => {
  const pageHash = dataStoreGetPageHash(data.page, omit(data, 'page'))
  const page = store.pages[pageHash]

  if (!page) {
    return undefined
  }

  const resultItems: Item[] = []
  for (const dataItem of store.items.values()) {
    if (dataItem.hash.includes(pageHash)) {
      resultItems.push(dataItem.item as Item)
    }
  }

  return {
    items: resultItems,
    meta: page.meta,
  }
}


export const dataStoreGetPageHash = (
  page: number,
  pageProps: AnyObject,
): Hash => {
  const arr = [
    page,
    ...(
      Object
        .entries(pageProps)
        .filter(i => i[0] !== 'meta' && i[0] !== 'page' && i[0] !== 'dataType')
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(a => a[1])
    )
  ]
  return arr.join(':')
}


/// SERIALIZE

export const dataStoreSerializeItems = (store: DataStore<any>): string => {
  const entries = [...store.items.entries()]
  return JSON.stringify({
    date: Date.now(),
    entries,
  })
}

export const dataStoreDeserializeItems = <T extends Model, DataEx extends AnyObject = {}, ItemEx extends AnyObject = {}> (
  store: DataStore<T, DataEx, ItemEx>,
  serializedData: string | null
): Map<number, DataItem<T, ItemEx>> | undefined => {
  if (!serializedData) {
    return undefined
  }

  try {
    //todo
    const data: { date: number, entries: Array<[number, DataItem<T, ItemEx>]> } = JSON.parse(serializedData)
    const now = Date.now()
    if (data.date + (store.defaultExpireIn ?? 0) < now) {
      return new Map(data.entries)
    }
  } catch {
  }

  return undefined
}

