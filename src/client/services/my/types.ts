import { User } from '../../../common/forum/models/user'
import { LoginRequest } from '../types'
import { IProfileResponse } from '../../../common/responses/forum.responses'


export interface IAuthService {
  login (params: LoginRequest): Promise<undefined | User>

  refreshToken (updateProfile?: boolean): Promise<boolean>

  logout (): Promise<void>

  logoutAll (): Promise<void>
}


export interface IProfileService {

  profile (): Promise<IProfileResponse | undefined>
}


export interface ApiSendConfig<T> {
  endpoint: string,
  method: 'get' | 'post' | 'delete' | 'put' | 'patch',
  body?: Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | string,
  json?: any,
  parseAsJson?: boolean,
  searchParams?: Record<string, any>,
  addHeaders?: Record<string, string>,
  withJWTHeaders?: boolean,
  withCookies?: boolean,
  refreshTokenIsAccessError?: boolean,
  reformat?: (data: T) => void,
  cancelable?: boolean,
}
