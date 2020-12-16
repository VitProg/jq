import { inject } from '../../../ioc/ioc.decoratos'
import { ApiServiceSymbol } from '../../ioc.symbols'
import { IApiService } from '../../types'
import { ICategory } from '../../../../common/forum/forum.base.interfaces'


export class CategoryService {
  @inject(ApiServiceSymbol) private readonly api!: IApiService

  async getAll (): Promise<ICategory[]> {
    const result = await this.api
      .get<ICategory[]>(
        'category'
      )
    return result ?? []
  }

}
