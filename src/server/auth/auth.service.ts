import { Injectable } from '@nestjs/common'
import crypto from 'crypto'
import { UserService } from '../user/user.service'
import { omit } from '../../common/utils/object'
import { JwtService } from '@nestjs/jwt'
import { IUser } from '../../common/forum/forum.interfaces'


@Injectable()
export class AuthService {
  constructor (
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    //
  }

  //todo move to encryptionService/Module
  hash (login: string, password: string) {
    const hash = crypto.createHash('sha1')
    hash.update(login.toLowerCase() + password)
    return hash.digest('hex')
  }

  async validateUser (username: string, password: string): Promise<IUser | undefined> {
    const login = username.includes('@') ? undefined : username;
    const email = username.includes('@') ? username : undefined;

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

  async login(user: IUser) {
    // const payload = { username: user.login, sub: user.id}
    return {
      access_token: this.jwtService.sign(user)
    }
  }


}
