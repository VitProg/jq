import { inject } from '../../../ioc/ioc.decoratos'
import { BoardService } from './board.service'
import { BoardServiceSymbol } from '../../ioc.symbols'
import { store } from '../../../store'


export class BoardPrepareService {
  @inject(BoardServiceSymbol) boardService!: BoardService

  async prepareAll() {
    const status = store.forumStore.boardStore.getStatus('getAll', false)
    if (status) {
      return
    }

    try {
      store.forumStore.boardStore.setStatus('getAll', false, 'pending')

      const boardList = await this.boardService.getAll()
      store.forumStore.boardStore.setMany({
        items: boardList
      })

      store.forumStore.boardStore.setStatus('getAll', false, 'loaded')
    } catch {
      store.forumStore.boardStore.setStatus('getAll', false, 'error')
    }
  }

}
