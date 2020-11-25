import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination'
import { IMessage, IUser } from './forum.interfaces'
import { MessageRelationsTypes } from './forum.entity-relations'


export type LastMessageResponse = Pagination<IMessage> & {relations?: MessageRelationsTypes}

export type ActiveUsersResponse = Pagination<IUser>
