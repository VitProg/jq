import { IBoard, ICategory, ITopic, IUser } from './forum.interfaces'
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
export const MessageAllRelations = [MessageRelations.board, MessageRelations.topic, MessageRelations.user]
