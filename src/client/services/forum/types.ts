import { LastMessageRequest } from '../types'
import { LastMessageResponse } from '../../../common/responses/forum.responses'
import { CancelablePromiseType } from 'cancelable-promise'


export interface IMessagesService {
  latest (params: LastMessageRequest): CancelablePromiseType<LastMessageResponse | undefined>
}
