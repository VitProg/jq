import { Gender } from './forum.constants'


export interface User {
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

export interface Message {
  id: number
  body: string
  createdAt?: Date
  updatedAt?: Date
  linksId: {
    user: number
    topic: number
    board: number
  },
  user?: User
  topic?: unknown
  board?: unknown
}

export interface Board {
  id: number
  url: string
  name: string
  description: string
  linksId: {
    category: number
  }
  category?: Category
}

export interface Category {
  id: number
  name: string
  order: number
}

export interface Topic {
  id: number
  isSticky: boolean
  url: string
  linksId: { board: number }
  board?: Board
}


