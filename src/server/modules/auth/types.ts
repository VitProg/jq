import { IUser } from '../../../common/forum/forum.interfaces'
import Omit = jest.Omit

export interface JwtStrategyValidatePayload {
  sub: number
  login: string
  lastTime: number
  iat: number
  exp: number
  fingerprintLight: any
}

export interface JwtRefreshTokenStrategyValidatePayload {
  sub: number
  fingerprintLight: any
}


export interface JwtSignPayload {
  user: Omit<IUser, 'auth' | 'email'>
  fingerprint: string
  fingerprintLight: string
}
