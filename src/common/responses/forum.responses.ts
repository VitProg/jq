import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination'
import { IMessage, IUser } from '../forum/forum.interfaces'
import { MessageRelationsRecord } from '../forum/forum.entity-relations'


export type LastMessageResponse = Pagination<IMessage> & {relations?: MessageRelationsRecord}

export type ActiveUsersResponse = Pagination<IUser>

