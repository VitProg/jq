
export interface User {
  id: number
  email: string
  login: string
  displayName: string
  url: string
  statistics: {
    posts: number
    karma: number
  }
}

export interface Message {
  id: number
  body: string
  createdAt: Date
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
