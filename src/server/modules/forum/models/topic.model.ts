import { IBoard, ITopic } from '../../../../common/forum/forum.interfaces'
import { ApiProperty } from '@nestjs/swagger'
import { BoardModel } from './board.model'


export class TopicModel implements ITopic {
  @ApiProperty()
  id!: number

  @ApiProperty()
  isSticky: boolean = false

  @ApiProperty()
  url!: string

  @ApiProperty()
  subject?: string

  @ApiProperty()
  linksId!: {
    board: number
  }

  @ApiProperty()
  board?: BoardModel
}
