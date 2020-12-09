import { IBoard, ICategory, IMessage, ITopic, IUser } from './forum.interfaces'
import webpack from 'webpack'


export enum MessageRelations {
  board = 'board',
  topic = 'topic',
  user = 'user',
  category = 'category',
}

export type MessageRelationsArray = Array<MessageRelations>
export type MessageRelationsRecord = {
  [MessageRelations.topic]?: Record<number, ITopic>,
  [MessageRelations.board]?: Record<number, IBoard>,
  [MessageRelations.user]?: Record<number, IUser>,
  [MessageRelations.category]?: Record<number, ICategory>,
}
export type MessageRelationsSingle = {
  [MessageRelations.topic]?: ITopic,
  [MessageRelations.board]?: IBoard,
  [MessageRelations.user]?: IUser,
  [MessageRelations.category]?: ICategory,
}
export const MessageAllRelations = Object.values(MessageRelations)



export enum TopicRelations {
  board = 'board',
  category = 'category',
  lastMessage = 'lastMessage',
}

export type TopicRelationsArray = Array<TopicRelations>
export type TopicRelationsRecord = {
  [TopicRelations.board]?: Record<number, IBoard>,
  [TopicRelations.category]?: Record<number, ICategory>,
  [TopicRelations.lastMessage]?: Record<number, IMessage>,
}
export type TopicRelationsSingle = {
  [TopicRelations.board]?: IBoard,
  [TopicRelations.category]?: ICategory,
  [TopicRelations.lastMessage]?: IMessage,
}
export const TopicAllRelations = Object.values(TopicRelations)


export enum BoardRelations {
  category = 'category',
  lastTopic = 'lastTopic',
  lastMessage = 'lastMessage',
}

export type BoardRelationsArray = Array<BoardRelations>
export type BoardRelationsRecord = {
  [BoardRelations.category]?: Record<number, ICategory>,
  [BoardRelations.lastTopic]?: Record<number, ITopic>,
  [BoardRelations.lastMessage]?: Record<number, IMessage>,
}
export type BoardRelationsSingle = {
  [BoardRelations.category]?: ICategory,
  [BoardRelations.lastTopic]?: ITopic,
  [BoardRelations.lastMessage]?: IMessage,
}
export const BoarAllRelations = Object.values(BoardRelations)
