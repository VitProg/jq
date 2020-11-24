import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination'
import { Message, User } from './forum.entities'
import { MessageRelationsTypes } from './forum.entity-relations'


export type LastMessageResponse = Pagination<Message> & {relations?: MessageRelationsTypes}

export type ActiveUsersResponse = Pagination<User>
