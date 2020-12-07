import { inject } from '../../../ioc/ioc.decoratos'
import { ApiServiceSymbol } from '../../ioc.symbols'
import { IApiService } from '../../types'
import { IBoard } from '../../../../common/forum/forum.interfaces'


export class BoardService {
  @inject(ApiServiceSymbol) private readonly api!: IApiService

  async getAll(): Promise<IBoard[]> {
    const result = await this.api
      .get<IBoard[]>(
        'board'
      )
    return result ?? []
  }

}
