import { inject } from '../../../ioc/ioc.decoratos'
import { CategoryServiceSymbol } from '../../ioc.symbols'
import { store } from '../../../store'
import { CategoryService } from './category.service'


export class CategoryPrepareService {
  @inject(CategoryServiceSymbol) categoryService!: CategoryService

  async prepareAll () {
    const status = store.forumStore.categoryStore.getStatus('getAll', false)
    if (status) {
      return
    }

    try {
      store.forumStore.categoryStore.setStatus('getAll', false, 'pending')

      const categoryList = await this.categoryService.getAll()
      store.forumStore.categoryStore.setMany({
        items: categoryList
      })

      store.forumStore.categoryStore.setStatus('getAll', false, 'loaded')
    } catch {
      store.forumStore.categoryStore.setStatus('getAll', false, 'error')
    }
  }
}
