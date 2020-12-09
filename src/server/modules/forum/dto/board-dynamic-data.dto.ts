import { MessageModel } from '../models/message.model'
import { ApiProperty } from '@nestjs/swagger'
import { IForumBoardDynamicData } from '../../../../common/responses/forum.responses'
import { TopicModel } from '../models/topic.model'


export class BoardDynamicDataDto implements IForumBoardDynamicData {
  @ApiProperty()
  id!: number

  @ApiProperty()
  lastMessage!: MessageModel | undefined

  @ApiProperty()
  lastTopic!: TopicModel | undefined

  @ApiProperty()
  topics!: number

  @ApiProperty()
  messages!: number
}
