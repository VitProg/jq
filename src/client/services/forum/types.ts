import { LastMessageRequest } from '../types'
import { ILatestMessageResponse } from '../../../common/responses/forum.responses'
import { CancelablePromiseType } from 'cancelable-promise'


export interface IMessagesService {
  latest (params: LastMessageRequest): CancelablePromiseType<ILatestMessageResponse | undefined>
}
