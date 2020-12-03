import { Gender } from '../../../../common/forum/forum.constants'
import { ApiProperty } from '@nestjs/swagger'
import { UserGroupDto } from '../../forum/dto/user-group.dto'
import { IUser } from '../../../../common/forum/forum.interfaces'


export class UserModel implements IUser {
  @ApiProperty()
  id!: number

  @ApiProperty()
  email?: string

  @ApiProperty()
  login!: string

  @ApiProperty()
  displayName!: string

  @ApiProperty()
  url!: string

  @ApiProperty()
  avatar!: string

  @ApiProperty()
  gender!: Gender

  @ApiProperty()
  statistics!: {
    posts: number
    karma: number
  }

  @ApiProperty()
  groupIds!: number[]

  @ApiProperty()
  lastLogin?: Date

  // @ApiProperty({ type: String, required: false })
  // get name () {
  //   return super.name
  // }
  //
  // @ApiProperty({ type: String, required: false })
  // get slug () {
  //   return super.name
  // }

  @ApiProperty()
  permissions?: string[]

  @ApiProperty()
  groups?: UserGroupDto[]
}
