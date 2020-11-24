import { Injectable } from '@nestjs/common'
import crypto from 'crypto'
import { UsersService } from '../users/users.service'
import { omit } from '../../../common/utils/object'
import { User } from '../../../common/forum/forum.entities'


@Injectable()
export class AuthService {
  constructor (
    private userService: UsersService,
  ) {
    //
  }

  hash (login: string, password: string) {
    const hash = crypto.createHash('sha1')
    hash.update(login.toLowerCase() + password)
    return hash.digest('hex')
  }

  async validateUser (login: string | undefined, email: string | undefined, password: string): Promise<User | undefined> {
    const user = await this.userService.getByLoginOrEmail({ login, email })

    if (!user || !user.auth?.passwordHash) {
      return undefined
    }

    const hash = this.hash(user.login, password)

    if (hash === user.auth.passwordHash) {
      return omit(user, 'auth')
    }

    return undefined
  }


}
