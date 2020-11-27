import { IUser } from '../../common/forum/forum.interfaces'
import { JwtRefreshTokenStrategyValidatePayload, JwtStrategyValidatePayload } from './types'

export function lastLoginForJwt (lastLogin: Date | undefined) {
  return lastLogin ? (lastLogin.getTime() / 1000) >>> 0 : -1
}

export function userToJwtPayload (user: IUser, lastTime: number, fingerprintLight: any): Omit<JwtStrategyValidatePayload, 'exp' | 'iat'> {
  return {
    sub: user.id,
    login: user.login,
    lastTime,
    fingerprintLight: fingerprintLight,
  }
}

export function userToJwtRefreshPayload (user: IUser, fingerprintLight: any): Omit<JwtRefreshTokenStrategyValidatePayload, 'exp' | 'iat'> {
  return {
    sub: user.id,
    // login: user.login,
    // displayName: user.displayName,
    // url: user.url,
    // avatar: user.avatar,
    fingerprintLight: fingerprintLight,
  }
}
