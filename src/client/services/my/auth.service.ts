import { IAuthService, IProfileService } from './types'
import { inject } from '../../ioc/ioc.decoratos'
import { IApiService, LoginRequest } from '../types'
import { makeAutoObservable } from 'mobx'
import { User } from '../../../common/forum/entities/user'
import { LoginResponse, RefreshTokenResponse } from '../../../common/responses/auth.responses'
import { store } from '../../store'
import { container } from '../../ioc/ioc.container'
import { ApiServiceSymbol, ProfileServiceSymbol } from '../ioc.symbols'


export class AuthService implements IAuthService {
  @inject(ApiServiceSymbol) api!: IApiService

  constructor () {
    makeAutoObservable(this)
  }

  async login (params: LoginRequest): Promise<undefined | User> {
    const response = await this.api
      .post<LoginResponse>(
        'auth/login',
        {
          json: params,
          withAuthHeaders: false,
          refreshTokenIsAccessError: false,
        }
      )

    if (response) {
      await this.saveSession(response.accessToken)
      await this.updateProfile()
    }

    return store.userStore.user
  }

  async refreshToken (updateProfile = false): Promise<boolean> {
    try {
      const response = await this.api
        .post<RefreshTokenResponse>(
          'auth/refresh-token',
          {
            withAuthHeaders: false,
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
      .post<LoginResponse>(
        'auth/logout',
        { withAuthHeaders: true }
      )

    this.clearSession()
  }

  async logoutAll () {
    await this.api
      .post<LoginResponse>(
        'auth/logoutAll',
        { withAuthHeaders: true }
      )

    this.clearSession()
  }


  // noinspection JSMethodCanBeStatic
  private clearSession () {
    store.userStore.clearUser()
  }

  private async saveSession (accessToken: string | undefined) {
    if (!accessToken) {
      return this.clearSession()
    }
    store.userStore.setToken(accessToken)
  }

  // noinspection JSMethodCanBeStatic
  private async updateProfile () {
    const profileService = container.get<IProfileService>(ProfileServiceSymbol)

    const user = User.create(await profileService.profile())
    if (user) {
      store.userStore.setUser(user, store.userStore.token)
    } else {
      store.userStore.clearUser()
    }
  }

}
