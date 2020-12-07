import { LastMessageRequest } from '../types'
import { ILatestMessageResponse } from '../../../common/responses/forum.responses'
import { CancelablePromiseType } from 'cancelable-promise'


export interface IForumService {
  prepare (): Promise<void>
}


export interface IMessageService {
  latest (params: LastMessageRequest): CancelablePromiseType<ILatestMessageResponse | undefined>
}

export interface IMessagePrepareService {
  prepareLatest (params: { page: number }): Promise<void>
}
