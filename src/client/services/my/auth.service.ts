import { IAuthService, IProfileService } from './types'
import { inject } from '../../ioc/ioc.decoratos'
import { IApiService, LoginRequest } from '../types'
import { makeAutoObservable } from 'mobx'
import { User } from '../../../common/forum/models/user'
import { ILoginResponse, IRefreshTokenResponse } from '../../../common/responses/auth.responses'
import { store } from '../../store'
import { container } from '../../ioc/ioc.container'
import { ApiServiceSymbol, ProfileServiceSymbol } from '../ioc.symbols'
import { createUserModel } from '../../../common/forum/fabrics/create-user.fabric'


export class AuthService implements IAuthService {
  @inject(ApiServiceSymbol) api!: IApiService

  constructor () {
    makeAutoObservable(this)
  }

  async login (params: LoginRequest): Promise<undefined | User> {
    const base64 = btoa(params.username + ':' + params.password);

    const response = await this.api
      .post<ILoginResponse>(
        'auth/login',
        {
          // json: params,
          withJWTHeaders: false,
          refreshTokenIsAccessError: false,
          addHeaders: {'Authorization': `Basic ${base64}`},
        }
      )

    if (response) {
      await this.saveSession(response.accessToken)
      await this.updateProfile()
    }

    return store.myStore.user
  }

  async refreshToken (updateProfile = false): Promise<boolean> {
    try {
      const response = await this.api
        .post<IRefreshTokenResponse>(
          'auth/refresh-token',
          {
            withJWTHeaders: false,
            refreshTokenIsAccessError: false,
          }
        )

      if (response) {
        await this.saveSession(response.accessToken)
        if (updateProfile) {
          await this.updateProfile()
        }
        return true
      }
      return false
    } catch {
      return false
    }
  }

  async logout () {
    await this.api
      .post<ILoginResponse>(
        'auth/logout',
        {
          withJWTHeaders: true,
          parseAsJson: false,
        }
      )

    this.clearSession()
  }

  async logoutAll () {
    await this.api
      .post<ILoginResponse>(
        'auth/logoutAll',
        {
          withJWTHeaders: true,
          parseAsJson: false,
        }
      )

    this.clearSession()
  }


  // noinspection JSMethodCanBeStatic
  private clearSession () {
    store.myStore.clearUser()
  }

  private async saveSession (accessToken: string | undefined) {
    if (!accessToken) {
      return this.clearSession()
    }
    store.myStore.setToken(accessToken)
  }

  // noinspection JSMethodCanBeStatic
  private async updateProfile () {
    const profileService = container.get<IProfileService>(ProfileServiceSymbol)

    const user = createUserModel(await profileService.profile())
    if (user) {
      store.myStore.setUser(user, store.myStore.token)
    } else {
      store.myStore.clearUser()
    }
  }

}
