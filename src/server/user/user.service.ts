import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MemberEntity } from '../entities'
import { FindManyOptions, FindOperator, Repository } from 'typeorm'
import { MemberEmailField, MemberLoginField } from '../forum/constants'
import { toUser, toUserMap } from '../forum/utils/mapper'
import { FindConditions } from 'typeorm/find-options/FindConditions'
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate'
import { ActiveUsersResponse } from '../../common/forum/forum.responses'
import { Topic, User } from '../../common/forum/forum.entities'


@Injectable()
export class UserService {
  constructor (
    @InjectRepository(MemberEntity) private readonly memberRepository: Repository<MemberEntity>,
  ) {
    //
  }

  async findByIdsToMap (ids: number[] | Set<number>, withFields: Array<'email' | 'auth'> = []): Promise<Map<number, User>> {
    const idSet = new Set(ids)
    const map = new Map<number, Topic>()
    const entities = await this.memberRepository.findByIds([...idSet])
    return toUserMap(entities, withFields)
  }

  async findByIds (ids: number[] | Set<number>, withFields: Array<'email' | 'auth'> = []): Promise<User[]> {
    return [...(await this.findByIdsToMap(ids, withFields)).values()]
  }

  async findByIdsToRecord(ids: number[] | Set<number>, withFields: Array<'email' | 'auth'> = []): Promise<Record<number, User>> {
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

    let where: FindConditions<MemberEntity> | Array<FindConditions<MemberEntity>> = []

    if (login && email) {
      where = [
        { [MemberLoginField]: login, [MemberEmailField]: email },
      ]
    } else if (login) {
      where = { [MemberLoginField]: login }
    } else if (email) {
      where = { [MemberEmailField]: email }
    }

    const member = await this.memberRepository.findOne({
      where,
    })

    return member ? toUser(member, ['email', 'auth']) : undefined
  }


  async getActiveUsers (options: IPaginationOptions): Promise<ActiveUsersResponse> {
    const findOptions: FindManyOptions<MemberEntity> = {
      where: {
        isSpammer: 0,
        posts: new FindOperator('moreThan', 0)
      },
      order: {
        posts: 'DESC',
        lastLogin: 'DESC'
      },
    }

    const data = await paginate(this.memberRepository, options, findOptions)

    return {
      ...data,
      items: data.items.map(m => toUser(m)),
    }
  }


}
