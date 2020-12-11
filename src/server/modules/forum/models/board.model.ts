import { IBoard } from '../../../../common/forum/forum.interfaces'
import { ApiProperty } from '@nestjs/swagger'


export class BoardModel implements IBoard {
  @ApiProperty()
  id!: number

  @ApiProperty()
  url!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  description!: string

  @ApiProperty()
  notice?: string

  @ApiProperty()
  onlyIndexNotice?: string

  @ApiProperty()
  settings!: {
    forGroups?: number[]
    onlyIndexGroups?: number[]
    order: number
    level: number
  }

  @ApiProperty()
  linksId!: {
    parent: number
    category: number
    lastMessage?: number
  }

  @ApiProperty()
  counters?: {
    topics: number
    messages: number
  }
}
