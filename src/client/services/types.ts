import { CancelablePromiseType } from 'cancelable-promise'
import { LastMessageResponse } from '../../common/responses/forum.responses'
import { User } from '../../common/forum/entities/user'
import { ProfileResponse } from '../../common/responses/my.responses'
import { ApiSendConfig } from './my/types'


export interface LastMessageRequest {
  relations?: Array<'board' | 'topic' | 'user'>
  pageSize?: number
  page?: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface IApiService {
  send<T> (config: ApiSendConfig<T>): Promise<T | undefined>
  get<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, 'json' | 'method' | 'endpoint'>): Promise<T | undefined>
  post<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, 'searchParams' | 'method' | 'endpoint'>): Promise<T | undefined>
  put<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, 'searchParams' | 'method' | 'endpoint'>): Promise<T | undefined>
  patch<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, 'searchParams' | 'method' | 'endpoint'>): Promise<T | undefined>
  delete<T> (endpoint: string, config?: Omit<ApiSendConfig<T>, 'searchParams' | 'method' | 'endpoint'>): Promise<T | undefined>
}

