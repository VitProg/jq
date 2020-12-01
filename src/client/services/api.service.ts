import KY from 'ky-universal'
import { LastMessageResponse } from '../../common/responses/forum.responses'
import { IApiService, LastMessageRequest, LoginRequest } from './interfaces'
import { abortedRequestPromise } from './utils'
import { action, makeObservable } from 'mobx'
import { User } from '../../common/forum/entities/user'
import { LoginResponse, RefreshTokenResponse } from '../../common/responses/auth.responses'
import { ProfileResponse } from '../../common/responses/my.responses'
import { store } from '../store'


export class ApiService implements IApiService {
  private readonly baseApiUrl = '/api' // todo from env
  private ky!: typeof KY

  constructor () {
    this.createKY()

    makeObservable(this, {
      loadLastMessages: action
    })
  }

  loadLastMessages (params: LastMessageRequest) {
    const abortController = new AbortController()

    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'relations':
          searchParams.set(key, value.join(','))
          break
        default:
          searchParams.set(key, value)
      }
    }

    const promise = this.ky
      .get('last-messages', {
        searchParams,
        signal: abortController.signal,
        headers: this.headers,
      })
      .json<LastMessageResponse>()

    return abortedRequestPromise(
      promise,
      abortController
    )
  }

  async login (params: LoginRequest): Promise<undefined | User> {
    const response = await this.ky.post('auth/login', {
      json: params,
      headers: this.headers,
    }).json<LoginResponse>()

    if (response) {
      await this.saveSession(response.accessToken)
      await this.updateProfile()
    }

    return store.userStore.user
  }

  async refreshToken (updateProfile = false): Promise<void> {
    try {
      const response = await this.ky
        .post('auth/refresh-token', { headers: {} })
        .json<RefreshTokenResponse>()

      if (response) {
        await this.saveSession(response.accessToken)
        if (updateProfile) {
          await this.updateProfile()
        }
      }
    } catch {
    }
  }

  async logout () {
    await this.ky
      .post('auth/logout', { headers: this.headers })
      .json<LoginResponse>()

    this.clearSession()
  }

  async logoutAll () {
    await this.ky
      .post('auth/logoutAll', { headers: this.headers })
      .json<LoginResponse>()

    this.clearSession()
  }

  async profile (): Promise<ProfileResponse | undefined> {
    return this.ky
      .get('my/profile', { headers: this.headers })
      .json<ProfileResponse>()
  }

  private clearSession () {
    store.userStore.clearUser()
    this.createKY()
  }

  private async saveSession (accessToken: string | undefined) {
    if (!accessToken) {
      return this.clearSession()
    }

    store.userStore.setToken(accessToken)

    this.createKY()
  }

  private async updateProfile() {
    const user = User.create(await this.profile())
    if (user) {
      store.userStore.setUser(user, store.userStore.token)
    } else {
      store.userStore.clearUser()
    }
  }

  private createKY () {
    this.ky = (this.ky?.extend ?? KY.create)({
      prefixUrl: this.baseApiUrl,
      headers: this.headers,
      credentials: 'same-origin',
      hooks: {
        afterResponse: [
          // Or retry with a fresh token on a 401 error
          async (input, options, response) => {
            if (response.status === 401) {
              debugger
              await this.refreshToken()
              return this.ky(input, {
                ...options,
                headers: {
                  ...options.headers,
                  ...this.headers,
                }
              });
            }
          }
        ],
      }
    })
  }

  private get headers () {
    return store.userStore.token ? {
      'Authorization': `Bearer ${store.userStore.token}`,
    } : {}
  }
}
