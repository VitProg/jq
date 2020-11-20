import { Board, Topic, User } from './types'


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

export function stringToRelationsArray<RA extends Array<any>>(str: string, relations: RA): RA {
  return (str ?? '').toString()
    .split(',')
    .map(i => i.trim().toLowerCase())
    .filter(i => relations.includes(i as any)) as any
}
