import { IBoard, ITopic, IUser } from './forum.interfaces'
import webpack from 'webpack'


export enum MessageRelations {
  board = 'board',
  topic = 'topic',
  user = 'user',
}

export type MessageRelationsArray = Array<MessageRelations>
export type MessageRelationsTypes = {
  [MessageRelations.topic]?: Record<number, ITopic>,
  [MessageRelations.board]?: Record<number, IBoard>,
  [MessageRelations.user]?: Record<number, IUser>,
}
export const MessageAllRelations = [MessageRelations.board, MessageRelations.topic, MessageRelations.user]
