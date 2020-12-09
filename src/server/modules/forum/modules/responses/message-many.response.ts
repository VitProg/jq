import { IForumMessageManyResponse } from '../../../../../common/responses/forum.responses'
import { PaginationResponse } from '../../../../common/responses/pagination.response'
import { IMessage } from '../../../../../common/forum/forum.interfaces'
import { MessageModel } from '../../models/message.model'
import { MessageRelationsDto } from '../../dto/message-relations.dto'


export class MessageManyResponse extends PaginationResponse<MessageModel> implements IForumMessageManyResponse {
  readonly items!: MessageModel[]
  relations?: MessageRelationsDto
}
