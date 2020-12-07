import { DataStore, ExtractItem, ForumStoreType, GetForumStore, IBoardStore, ICategoryStore, IForumStore, IMessageStore, ITopicStore, IUserStore, Model, RelationsMap } from './types'
import { IRouteStore, IUIStore } from '../types'
import { getBlankRelationsMap } from './utils'
import { BoardStore } from './board.store'
import { CategoryStore } from './category.store'
import { TopicStore } from './topic.store'
import { UserStore } from './user.store'
import { makeObservable } from 'mobx'
import { MessageStore } from './message.store'


export class ForumStore implements IForumStore {
  readonly boardStore: IBoardStore
  readonly categoryStore: ICategoryStore
  readonly messageStore: IMessageStore
  readonly topicStore: ITopicStore
  readonly userStore: IUserStore

  constructor (
    readonly routeStore: IRouteStore,
    readonly uiStore: IUIStore,
  ) {
    this.boardStore = new BoardStore(this)
    this.categoryStore = new CategoryStore(this)
    this.messageStore = new MessageStore(this)
    this.topicStore = new TopicStore(this)
    this.userStore = new UserStore(this)

    makeObservable(this, {})
  }

  getRelations<DataType extends ForumStoreType, Item extends ExtractItem<GetForumStore<DataType>>> (
    dataType: DataType,
    items: Item[] | undefined,
  ): RelationsMap<DataType> {
    const relations = getBlankRelationsMap(dataType)

    // todo check it
    if (items) {
      for (const item of items as Model[]) {
        this.fillRelations(relations, item.linksId, dataType)
      }
    }
    return relations
  }

  private fillRelations = (
    relations: RelationsMap<any>,
    linksId: Partial<Record<ForumStoreType, number>> | undefined,
    currentType: ForumStoreType
  ) => {
    if (!linksId) {
      return
    }

    for (const [dt, id] of Object.entries(linksId)) {
      if (id) {
        if (!(dt in relations)) {
          (relations as any)[dt] = {}
        }

        if (!(id in (relations as any)[dt])) {
          const dataType = (dt === 'parent' ? currentType : dt) as ForumStoreType
          const store = this.getStore(dataType)
          const item = store.get(id) as Model
          if (item) {
            (relations as any)[dt][id] = item

            this.fillRelations(relations, item.linksId, dataType)
          }
        }
      }
    }
  }

  getStore<DataType extends ForumStoreType> (dataType: DataType): GetForumStore<DataType> {
    return (this as any)[dataType + 'Store']
  }

  clearAll () {
    this.messageStore.clear()
    this.boardStore.clear()
    this.categoryStore.clear()
    this.topicStore.clear()
    this.userStore.clear()
  }
}
