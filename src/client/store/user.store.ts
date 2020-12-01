import { IRootStore, IUserStore } from './types'
import { action, makeObservable, observable } from 'mobx'
import { User } from '../../common/forum/entities/user'
import { container } from '../ioc/ioc.container'
import { IApiService } from '../services/interfaces'
import { ApiServiceSymbol } from '../ioc/ioc.symbols'


const REFRESH_TOKEN_INTERVAL = 4.5 * 60 * 1000 // 4.5 minutes

export class UserStore implements IUserStore {
  user?: User = undefined
  token?: string = undefined
  private refreshTokenInterval: number | undefined

  constructor (readonly root: IRootStore) {
    makeObservable(this, {
      // root: false
      user: observable,
      token: observable,
      setUser: action,
      clearUser: action,
    })
  }

  private refreshTokenTick () {
    container.get<IApiService>(ApiServiceSymbol).refreshToken()
      .catch((e) => {
        console.warn(e)
      })
  }

  private startRefreshTokenInterval () {
    debugger
    this.stopRefreshTokenInterval()
    this.refreshTokenInterval = setInterval(() => this.refreshTokenTick(), REFRESH_TOKEN_INTERVAL)
  }

  private stopRefreshTokenInterval () {
    if (this.refreshTokenInterval) {
      clearInterval(this.refreshTokenInterval)
      this.refreshTokenInterval = undefined
    }
  }

  setUser (user: User, token?: string) {
    this.user = user
    this.token = token
    if (this.token) {
      this.startRefreshTokenInterval()
    }
  }

  setToken (token?: string): void {
    this.stopRefreshTokenInterval()
    this.token = token
    if (this.token) {
      debugger
      this.startRefreshTokenInterval()
    }
  }

  clearUser () {
    this.user = undefined
    this.token = undefined
    this.stopRefreshTokenInterval()
  }


}
