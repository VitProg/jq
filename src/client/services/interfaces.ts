import { LastMessageRequest } from './api.service'
import { LastMessageResponse } from '../../common/forum/forum.responses'
import { CancelablePromiseType } from 'cancelable-promise'


export interface IApiService {
  loadLastMessages (params: LastMessageRequest): CancelablePromiseType<LastMessageResponse>
}
