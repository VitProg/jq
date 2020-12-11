import { makeAutoObservable } from 'mobx'
import { ITopicService } from '../types'
import { inject } from '../../../ioc/ioc.decoratos'
import { IApiService } from '../../types'
import { IForumMessageManyResponse, IForumTopicManyResponse } from '../../../../common/responses/forum.responses'
import { ApiServiceSymbol } from '../../ioc.symbols'
import { MessageByUserRequest, TopicByBoardRequest, TopicByUserRequest, TopicLatestRequest } from '../../api.requests'
import { TopicRelations, TopicRelationsArray } from '../../../../common/forum/forum.entity-relations'
import { IMessage, ITopic } from '../../../../common/forum/forum.interfaces'
import { uniqueArray } from '../../../../common/utils/array'


const LATEST_MAX_PAGES = 10
const DEFAULT_LATEST_PAGE_SIZE = 20
const DEFAULT_WITH_RELATIONS: TopicRelationsArray = [TopicRelations.board, TopicRelations.category, TopicRelations.lastMessage, TopicRelations.lastUser]


export class TopicService implements ITopicService {
  @inject(ApiServiceSymbol) api!: IApiService

  constructor () {
    makeAutoObservable(this)
  }

  latest (request: TopicLatestRequest) {
    const searchParams: typeof request = {
      pageSize: DEFAULT_LATEST_PAGE_SIZE,
      relations: DEFAULT_WITH_RELATIONS,
      ...request
    }

    return this.api
      .get<IForumTopicManyResponse>(
        'topic/latest',
        {
          searchParams,
          reformat: (data) => {
            data.meta.currentPage = data.meta.currentPage >>> 0
            data.meta.totalItems = Math.min(LATEST_MAX_PAGES * data.meta.itemsPerPage, data.meta.totalItems)
            data.meta.totalPages = Math.min(LATEST_MAX_PAGES, data.meta.totalPages)
          },
        })
  }

  byBoard (request: TopicByBoardRequest) {
    const { board, ...forRequest } = request

    const searchParams = {
      pageSize: DEFAULT_LATEST_PAGE_SIZE,
      relations: DEFAULT_WITH_RELATIONS,
      ...forRequest
    }

    return this.api
      .get<IForumTopicManyResponse>(
        `topic/board/${board}`,
        {
          searchParams,
        })
  }

  byUser (request: TopicByUserRequest) {
    const { user, ...forRequest } = request

    const searchParams = {
      pageSize: DEFAULT_LATEST_PAGE_SIZE,
      relations: DEFAULT_WITH_RELATIONS,
      ...forRequest
    }

    return this.api
      .get<IForumTopicManyResponse>(
        `topic/user/${user}`,
        {
          searchParams,
        })
  }


  async byId (id: number) {
    try {
      return await this.api
        .get<ITopic | undefined>(`topic/${id}`)
    } catch {
      return undefined
    }
  }

  async byIds (ids: number[]) {
    if (ids.length === 0) {
      return [] as ITopic[]
    }

    if (ids.length === 1) {
      const item = await this.byId(ids[0])
      return item ? [item] : []
    }

    try {
      const items = await this.api
        .get<ITopic[]>(`topic/many/${uniqueArray(ids).join('|')}`)
      return items ?? []
    } catch {
      return [] as ITopic[]
    }
  }


}
