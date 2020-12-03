import { IProfileService } from './types'
import { inject } from '../../ioc/ioc.decoratos'
import { IApiService } from '../types'
import { makeAutoObservable } from 'mobx'
import { ApiServiceSymbol } from '../ioc.symbols'
import { IProfileResponse } from '../../../common/responses/forum.responses'


export class ProfileService implements IProfileService {
  @inject(ApiServiceSymbol) api!: IApiService

  constructor () {
    makeAutoObservable(this)
  }

  async profile (): Promise<IProfileResponse | undefined> {
    return this.api
      .get<IProfileResponse>(
        'my/profile',
        {
          withJWTHeaders: true,
        }
      )
  }
}
