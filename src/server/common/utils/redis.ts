
export const getKeyBoardLevel = (level: string) => `sorted:board:${level}`
export const getKeyBoardLatestLevel = (level: string) => `sorted:board-latest:${level}`

export const getKeyTopicBoardLevel = (boardId: number, level: string) => `sorted:topic:board:${boardId}:${level}`
export const getKeyTopicLatestLevel = (level: string) => `sorted:topic-latest:${level}`

export const getKeyMessageBoardLevel = (boardId: number, level: string, order: 'asc' | 'desc') => `sorted:message:board:${boardId}:${level}:${order}`
export const getKeyMessageTopicLevel = (topicId: number, level: string, order: 'asc' | 'desc') => `sorted:message:topic:${topicId}:${level}:${order}`
export const getKeyMessageLatestLevel = (level: string) => `sorted:message-latest:${level}`
export const getKeyMessageBoardLatestLevel = (boardId: number, level: string) => `sorted:topic-latest:board:${boardId}:${level}`

