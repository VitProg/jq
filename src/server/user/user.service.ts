import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AttachmentEntity, MemberEntity } from '../entities'
import { FindManyOptions, FindOperator, Repository, SelectQueryBuilder } from 'typeorm'
import { MemberEmailField, MemberLoginField } from '../forum/constants'
import { toUser, toUserMap } from '../forum/utils/mapper'
import { FindConditions } from 'typeorm/find-options/FindConditions'
import { IPaginationOptions, paginate, paginateRaw, Pagination } from 'nestjs-typeorm-paginate'
import { ActiveUsersResponse } from '../../common/forum/forum.responses'
import { ITopic, IUser } from '../../common/forum/forum.interfaces'
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral'
import { AnyObject } from '../../common/utils/object'


@Injectable()
export class UserService {
  constructor (
    @InjectRepository(MemberEntity) private readonly memberRepository: Repository<MemberEntity>,
  ) {
    //
  }

  private query(): SelectQueryBuilder<MemberEntity> {
    return this.memberRepository
      .createQueryBuilder()
      .addSelect('a.filename as member_avatar')
      .leftJoin(AttachmentEntity, 'a', `a.id_member = ${MemberEntity.name}.id_member AND a.attachment_type = 1 AND a.approved = 1`)
  }

  private rawToItems(data: {entities: MemberEntity[], raw: AnyObject[]}, withFields: Array<'email' | 'auth'> = []) {
    return data.entities.map((value: any, index: number) => ({
      ...value,
      avatar: data.raw[index]?.member_avatar,
    })).map(m => toUser(m, withFields))
  }

  private rawToMap(data: {entities: MemberEntity[], raw: AnyObject[]}, withFields: Array<'email' | 'auth'> = []) {
    return toUserMap(data.entities.map((value: any, index: number) => ({
      ...value,
      avatar: data.raw[index]?.member_avatar,
    })))
  }



  async findByIdsToMap (ids: number[] | Set<number>, withFields: Array<'email' | 'auth'> = []): Promise<Map<number, IUser>> {
    const idSet = new Set(ids)
    const data = await this.query()
      .whereInIds([...idSet])
      .getRawAndEntities()
    return this.rawToMap(data, withFields)
  }

  async findByIds (ids: number[] | Set<number>, withFields: Array<'email' | 'auth'> = []): Promise<IUser[]> {
    return [...(await this.findByIdsToMap(ids, withFields)).values()]
  }

  async findByIdsToRecord(ids: number[] | Set<number>, withFields: Array<'email' | 'auth'> = []): Promise<Record<number, IUser>> {
    const map = await this.findByIdsToMap(ids, withFields)
    return Object.fromEntries(map.entries())
  }

  async getByLogin (login: string) {
    return this.getByLoginOrEmail({ login })
  }

  async getByEmail (email: string) {
    return this.getByLoginOrEmail({ email })
  }

  async getByLoginOrEmail (config: { login?: string, email?: string }) {
    const login = config.login?.trim()
    const email = config.email?.trim()

    if (!login && !email) {
      return undefined
    }

    let where: ObjectLiteral | Array<ObjectLiteral> = []

    if (login && email) {
      where = {
        [MemberLoginField]: login, [MemberEmailField]: email,
      }
    } else if (login) {
      where = { [MemberLoginField]: login }
    } else if (email) {
      where = { [MemberEmailField]: email }
    }

    const data = await this.query()
      .where(where)
      // .getRawOne()
      .getRawAndEntities()

    const items = this.rawToItems(data, ['email', 'auth'])
    return items?.[0]
  }


  async getActiveUsers (options: IPaginationOptions): Promise<ActiveUsersResponse> {
    // todo переделать когда зальется тот ПР https://github.com/nestjsx/nestjs-typeorm-paginate/pull/375
    const query = this.query()
      .where({
        isSpammer: 0,
        posts: new FindOperator('moreThan', 0)
      })
      .orderBy({
        posts: 'DESC',
        last_login: 'DESC'
      })
      .limit(options.limit)
      .skip((options.page - 1) * options.limit)

    const data = await query.getRawAndEntities()
    const totalItems = await query.getCount();

    const items = this.rawToItems(data)

    return {
      items,
      meta: {
        totalPages: Math.ceil(totalItems / options.limit),
        currentPage: options.page,
        itemsPerPage: options.limit,
        itemCount: items.length,
        totalItems,
      }
    }
  }


}
