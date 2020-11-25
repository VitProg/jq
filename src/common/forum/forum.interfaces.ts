import { Gender } from './forum.constants'


export interface IUser {
  id: number
  email?: string
  login: string
  displayName: string
  url: string
  avatar: string
  gender: Gender
  statistics: {
    posts: number
    karma: number
  }
  auth?: {
    passwordHash?: string
    token?: string
    salt?: string
  }
}

export interface IMessage {
  id: number
  body: string
  createdAt?: Date
  updatedAt?: Date
  linksId: {
    user: number
    topic: number
    board: number
  },
  user?: IUser
  topic?: unknown
  board?: unknown
}

export interface IBoard {
  id: number
  url: string
  name: string
  description: string
  linksId: {
    category: number
  }
  category?: ICategory
}

export interface ICategory {
  id: number
  name: string
  order: number
}

export interface ITopic {
  id: number
  isSticky: boolean
  url: string
  subject?: string
  linksId: { board: number }
  board?: IBoard
}


