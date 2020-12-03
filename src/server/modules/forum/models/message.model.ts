import { IMessage } from '../../../../common/forum/forum.interfaces'
import { UserModel } from '../../user/models/user.model'
import { ApiProperty } from '@nestjs/swagger'
import { TopicModel } from './topic.model'
import { BoardModel } from './board.model'


export class MessageModel implements IMessage {
  @ApiProperty()
  id!: number

  @ApiProperty()
  body!: string

  @ApiProperty()
  createdAt?: Date

  @ApiProperty()
  updatedAt?: Date

  @ApiProperty()
  linksId!: {
    user: number
    topic: number
    board: number
  }

  @ApiProperty()
  user?: UserModel

  @ApiProperty()
  topic?: TopicModel

  @ApiProperty()
  board?: BoardModel
}
