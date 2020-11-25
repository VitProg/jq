import KY from 'ky-universal'
import { LastMessageResponse } from '../../common/forum/forum.responses'
import { IApiService } from './interfaces'
import { abortedRequestPromise } from './utils'


export interface LastMessageRequest {
  relations?: Array<'board' | 'topic' | 'user'>
  pageSize?: number
  page?: number
}

export class ApiService implements IApiService {
  readonly baseApiUrl = '/api' // todo from env
  private ky: typeof KY

  constructor () {
    this.ky = KY.create({
      prefixUrl: this.baseApiUrl,
      //todo
    })
  }

  loadLastMessages (params: LastMessageRequest) {
    const abortController = new AbortController()

    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'relations':
          searchParams.set(key, value.join(','))
          break
        default:
          searchParams.set(key, value)
      }
    }

    const promise = this.ky
      .get('last-messages', {
        searchParams,
        signal: abortController.signal,
      })
      .json<LastMessageResponse>()

    return abortedRequestPromise(
      promise,
      abortController
    )
  }

}
