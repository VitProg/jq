import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MemberEntity } from '../../entities'
import { Repository } from 'typeorm'
import { MemberEmailField, MemberLoginField } from '../constants'
import { toUser } from '../utils/mapper'
import { FindConditions } from 'typeorm/find-options/FindConditions'


@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(MemberEntity) private readonly memberRepository: Repository<MemberEntity>,
  ) {
    //
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


}
