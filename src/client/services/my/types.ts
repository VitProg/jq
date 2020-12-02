import { ProfileResponse } from '../../../common/responses/my.responses'
import { User } from '../../../common/forum/entities/user'
import { LoginRequest } from '../types'


export interface IAuthService {
  login (params: LoginRequest): Promise<undefined | User>

  refreshToken (updateProfile?: boolean): Promise<boolean>

  logout (): Promise<void>

  logoutAll (): Promise<void>
}


export interface IProfileService {

  profile (): Promise<ProfileResponse | undefined>
}


export interface ApiSendConfig<T> {
  endpoint: string,
  method: 'get' | 'post' | 'delete' | 'put' | 'patch',
  body?: Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | string,
  json?: any,
  searchParams?: Record<string, any>,
  addHeaders?: Record<string, string>,
  withAuthHeaders?: boolean,
  withCookies?: boolean,
  refreshTokenIsAccessError?: boolean,
  reformat?: (data: T) => void,
  cancelable?: boolean,
}
