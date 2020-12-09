import { IForumService, IMessagePrepareService, IMessageService, ITopicPrepareService } from './types'
import { inject } from '../../ioc/ioc.decoratos'
import {
  BoardPrepareServiceSymbol,
  CategoryPrepareServiceSymbol,
  MessagePrepareServiceSymbol,
  MessageServiceSymbol, TopicPrepareServiceSymbol
} from '../ioc.symbols'
import { store } from '../../store'
import { makeAutoObservable, reaction } from 'mobx'
import { BoardPrepareService } from './board/board-prepare.service'
import { CategoryPrepareService } from './category/category-prepare.service'


export class ForumService implements IForumService {
  @inject(MessageServiceSymbol) messageService!: IMessageService
  @inject(MessagePrepareServiceSymbol) messagePrepareService!: IMessagePrepareService
  @inject(TopicPrepareServiceSymbol) topicPrepareService!: ITopicPrepareService
  @inject(BoardPrepareServiceSymbol) boardPrepareService!: BoardPrepareService
  @inject(CategoryPrepareServiceSymbol) categoryPrepareService!: CategoryPrepareService

  private preparing = false

  prepare (): Promise<void> {
    if (!this.preparing) {
      this.preparing = true
      return Promise.all([
        this.categoryPrepareService.prepareAll(),
        this.boardPrepareService.prepareAll(),
      ]).then(() => {
        return
      }).finally(() => {
        this.preparing = false
      })
    }
    return Promise.resolve()
  }

  //todo add other services


  constructor () {
    makeAutoObservable(this, {
      messageService: false,
      //todo
    })

    let lastIsAuth: boolean | undefined

    reaction(
      () => [
        store.routeStore.current,
        store.routeStore.noModalRoute,
        store.myStore.isAuth,
      ],
      async () => {
        const auth = store.myStore.isAuth
        if (lastIsAuth !== undefined && auth !== lastIsAuth) {
          //clear all cache
          store.forumStore.clearAll()
          await this.prepare()
        }

        lastIsAuth = auth

        const route = store.routeStore.noModalRoute ?? store.routeStore.current

        let processed = false

        if (!processed) processed = this.messagePrepareService.processRoute(route)
        if (!processed) processed = this.topicPrepareService.processRoute(route)

      }, {
        fireImmediately: true
      })

    setTimeout(() => this.prepare())
  }
}
