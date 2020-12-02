import { IProfileService } from './types'
import { inject } from '../../ioc/ioc.decoratos'
import { IApiService } from '../types'
import { makeAutoObservable } from 'mobx'
import { ProfileResponse } from '../../../common/responses/my.responses'
import { ApiServiceSymbol } from '../ioc.symbols'


export class ProfileService implements IProfileService {
  @inject(ApiServiceSymbol) api!: IApiService

  constructor () {
    makeAutoObservable(this)
  }

  async profile (): Promise<ProfileResponse | undefined> {
    return this.api
      .get<ProfileResponse>(
        'my/profile',
        {
          withAuthHeaders: true,
        }
      )
  }
}
