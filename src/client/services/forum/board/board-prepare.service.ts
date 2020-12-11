import { inject } from '../../../ioc/ioc.decoratos'
import { BoardService } from './board.service'
import { BoardServiceSymbol, UserPrepareServiceSymbol } from '../../ioc.symbols'
import { store } from '../../../store'
import { StoredRoute } from '../../../store/types'
import { isRoute } from '../../../routing/utils'
import { mute } from '../../../../common/utils/promise'
import { UserPrepareService } from '../user/user-prepare.service'


export class BoardPrepareService {
  @inject(BoardServiceSymbol) boardService!: BoardService
  @inject(UserPrepareServiceSymbol) userPrepareService!: UserPrepareService

  processRoute (route?: StoredRoute): boolean {
      if (isRoute(route, 'index')) {

        mute(this.prepareStat())

        return true
      }

      return false
  }


  async prepareAll() {
    const status = store.forumStore.boardStore.getStatus('getAll', false)
    if (status) {
      return
    }

    try {
      store.forumStore.boardStore.setStatus('getAll', false, 'pending')

      const boardList = await this.boardService.getAll()
      store.forumStore.boardStore.setMany({
        items: boardList.items
      })

      store.forumStore.boardStore.setStatus('getAll', false, 'loaded')
    } catch {
      store.forumStore.boardStore.setStatus('getAll', false, 'error')
    }
  }

  async prepareStat() {
    await this.prepareAll()
    try {
      //todo
      const boardIds = store.forumStore.boardStore.getAll(false).map(board => board.id)
      const boards = store.forumStore.boardStore.getAll(true)

      const stat = await this.boardService.getStat(boardIds)

      const userIds = new Set<number>()

      for (const statItem of stat) {
        const board = boards[statItem.id]
        if (board) {
          if (statItem.lastMessage) {
            userIds.add(statItem.lastMessage.linksId.user)
          }
          store.forumStore.boardStore.set({
            item: {
              ...board,
              settings: {
                ...board.settings,
              },
              linksId: {
                ...board.linksId,
                lastMessage: statItem.lastMessage?.id,
                lastTopic: statItem.lastTopic?.id,
                lastUser: statItem?.lastUser?.id
              },
              counters: {
                ...board.counters,
                topics: statItem.topics,
                messages: statItem.messages,
              },
            }
          })

          if (statItem.lastTopic) {
            store.forumStore.topicStore.set({
              item: {...statItem.lastTopic}
            })
          }

          if (statItem.lastMessage) {
            store.forumStore.messageStore.set({
              item: {...statItem.lastMessage}
            })
          }

          if (statItem.lastUser) {
            store.forumStore.userStore.set({
              item: {...statItem.lastUser}
            })
            userIds.delete(statItem.lastUser.id)
          }

        }
      }

      if (userIds.size > 0) {
        let ids = [...userIds.values()]
        const usersInStore = store.forumStore.userStore.getMany(ids, true) ?? {}
        ids = ids.filter(id => !(id in usersInStore))
        console.log('NEED LOAD USERS BY IDS', ids)
        mute(this.userPrepareService.prepareAndGet(ids))
      }

    } catch {

    }
  }

}
