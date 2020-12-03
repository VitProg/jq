import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AttachmentEntity, MemberEntity } from '../../entities'
import { FindOperator, Repository, SelectQueryBuilder } from 'typeorm'
import { MemberEmailField, MemberIdField, MemberLoginField } from '../forum/constants'
import { toUser, toUserMap } from '../forum/utils/mapper'
import { IPaginationOptions } from 'nestjs-typeorm-paginate'
import { IActiveUsersResponse } from '../../../common/responses/forum.responses'
import { IUser } from '../../../common/forum/forum.interfaces'
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral'
import { AnyObject } from '../../../common/utils/object'
import { PermissionService } from './permission/permission.service'
import { WithFields } from './types'
import { UserGroupService } from './user-group/user-group.service'


@Injectable()
export class UserService {
  constructor (
    @InjectRepository(MemberEntity) private readonly memberRepository: Repository<MemberEntity>,
    private readonly permissionService: PermissionService,
    private readonly userGroupService: UserGroupService,
  ) {
    //
  }

  private query (): SelectQueryBuilder<MemberEntity> {
    return this.memberRepository
      .createQueryBuilder()
      .addSelect('a.filename as member_avatar')
      .leftJoin(AttachmentEntity, 'a', `a.id_member = ${MemberEntity.name}.id_member AND a.attachment_type = 1 AND a.approved = 1`)
  }

  private async rawToItems (data: { entities: MemberEntity[], raw: AnyObject[] }, withFields: WithFields) {
    let items = data.entities
      .map((value: any, index: number) => ({
        ...value,
        avatar: data.raw[index]?.member_avatar,
      }))
      .map(m => toUser(m, withFields))

    if (withFields.includes('permissions')) {
      items = await this.permissionService.fillForUsers(items)
    }

    if (withFields.includes('groups')) {
      items = await this.userGroupService.fillForUsers(items)
    }

    return items
  }

  private async rawToMap (data: { entities: MemberEntity[], raw: AnyObject[] }, withFields: WithFields) {
    let map = toUserMap(
      data.entities
        .map((value: any, index: number) => ({
          ...value,
          avatar: data.raw[index]?.member_avatar,
        }))
    )

    if (withFields.includes('permissions')) {
      map = await this.permissionService.fillForUsers(map)
    }

    if (withFields.includes('groups')) {
      map = await this.userGroupService.fillForUsers(map)
    }

    return map
  }


  async findByIdsToMap (ids: number[] | Set<number>, withFields: WithFields = []): Promise<Map<number, IUser>> {
    const idSet = new Set(ids)
    const data = await this.query()
      .whereInIds([...idSet])
      .getRawAndEntities()
    return await this.rawToMap(data, withFields)
  }

  async findByIds (ids: number[] | Set<number>, withFields: WithFields = []): Promise<IUser[]> {
    return [...(await this.findByIdsToMap(ids, withFields)).values()]
  }

  async findByIdsToRecord (ids: number[] | Set<number>, withFields: WithFields = []): Promise<Record<number, IUser>> {
    const map = await this.findByIdsToMap(ids, withFields)
    return Object.fromEntries(map.entries())
  }

  async getByLogin (login: string, withFields: WithFields = []) {
    return this.getByLoginOrEmail({ login }, withFields)
  }

  async getByEmail (email: string, withFields: WithFields = []) {
    return this.getByLoginOrEmail({ email }, withFields)
  }

  async getById (id: number, withFields: WithFields = ['email', 'auth']): Promise<IUser | undefined> {
    const data = await this.query()
      .where({ [MemberIdField]: id })
      .getRawAndEntities()

    const items = await this.rawToItems(data, withFields)
    return items?.[0]
  }

  async getByLoginOrEmail (config: { login?: string, email?: string }, withFields: WithFields = ['email', 'auth']) {
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

    const items = await this.rawToItems(data, withFields)
    return items?.[0]
  }


  async getActiveUsers (options: IPaginationOptions, withFields: WithFields = []): Promise<IActiveUsersResponse> {
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
      .offset((options.page - 1) * options.limit)

    const data = await query.getRawAndEntities()
    const totalItems = await query.getCount()

    const items = await this.rawToItems(data, withFields)

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


  getUserByRefreshToken (refreshToken: string, fingerprintLight: Promise<string>, userId: number) {
    return Promise.resolve(undefined)
  }

  async updateLastLogin (id: number) {
    return ((await this.memberRepository.update(
      {
        [MemberIdField]: id,
      },
      {
        lastLogin: () => 'unix_timestamp()',
      }
    )).affected ?? 0) > 0
  }
}
