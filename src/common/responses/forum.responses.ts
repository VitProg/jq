import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination'
import { IBoard, IMessage, ITopic, IUser } from '../forum/forum.interfaces'
import { BoardRelationsRecord, MessageRelationsRecord, TopicRelationsRecord } from '../forum/forum.entity-relations'
import { TopicModel } from '../../server/modules/forum/models/topic.model'


export type IForumMessageManyResponse = Pagination<IMessage> & { relations?: MessageRelationsRecord }
export type IForumTopicManyResponse = Pagination<ITopic> & { relations?: TopicRelationsRecord }
export type IForumBoardManyResponse = { items: IBoard[], relations?: BoardRelationsRecord }

export type IActiveUsersResponse = Pagination<IUser>

export type IProfileResponse = IUser

export interface IForumBoardDynamicData {
  id: number
  lastMessage: IMessage | undefined
  lastTopic: TopicModel | undefined
  topics: number
  messages: number
}

export type IForumBoardDynamicDataResponse = Array<IForumBoardDynamicData>
