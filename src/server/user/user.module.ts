import { Module } from '@nestjs/common';
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionService } from './permission/permission.service';
import { UserGroupService } from './user-group/user-group.service';
import * as Entities from '../entities'
import { ForumCacheModule } from '../forum/forum-cache/forum-cache.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Entities.MemberEntity,
      Entities.MemberGroupEntity,
      Entities.PermissionEntity,
    ]),
    ForumCacheModule,
  ],
  providers: [
    UserService,
    PermissionService,
    UserGroupService,
  ],
  exports: [
    UserService,
  ]
})
export class UserModule {}
