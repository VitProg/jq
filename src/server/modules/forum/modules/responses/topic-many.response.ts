import { IForumTopicManyResponse } from '../../../../../common/responses/forum.responses'
import { PaginationResponse } from '../../../../common/responses/pagination.response'
import { TopicModel } from '../../models/topic.model'
import { TopicRelationsDto } from '../../dto/topic-relations.dto'


export class TopicManyResponse extends PaginationResponse<TopicModel> implements IForumTopicManyResponse {
  readonly items!: TopicModel[]
  relations?: TopicRelationsDto
}
