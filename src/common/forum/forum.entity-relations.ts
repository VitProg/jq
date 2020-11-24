import { Board, Topic, User } from './forum.entities'


export enum MessageRelations {
  board = 'board',
  topic = 'topic',
  user = 'user',
}

export type MessageRelationsArray = Array<MessageRelations>
export type MessageRelationsTypes = {
  [MessageRelations.topic]?: Record<number, Topic>,
  [MessageRelations.board]?: Record<number, Board>,
  [MessageRelations.user]?: Record<number, User>,
}
export const MessageAllRelations = [MessageRelations.board, MessageRelations.topic, MessageRelations.user]
