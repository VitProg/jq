import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination'
import { IMessage, IUser } from './forum.interfaces'
import { MessageRelationsRecord } from './forum.entity-relations'


export type LastMessageResponse = Pagination<IMessage> & {relations?: MessageRelationsRecord}

export type ActiveUsersResponse = Pagination<IUser>
