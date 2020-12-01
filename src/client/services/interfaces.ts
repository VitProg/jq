import { CancelablePromiseType } from 'cancelable-promise'
import { LastMessageResponse } from '../../common/responses/forum.responses'
import { User } from '../../common/forum/entities/user'
import { ProfileResponse } from '../../common/responses/my.responses'


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
  // readonly user?: User
  // readonly accessToken?: string

  loadLastMessages (params: LastMessageRequest): CancelablePromiseType<LastMessageResponse>

  login (params: LoginRequest): Promise<undefined | User>

  refreshToken (updateProfile?: boolean): Promise<void>

  logout (): Promise<void>

  logoutAll (): Promise<void>

  profile (): Promise<ProfileResponse | undefined>
}
