import { Module } from '@nestjs/common';
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PermissionService } from './permission/permission.service';
import * as Entities from '../entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Entities.AttachmentEntity,
      // Entities.BoardEntity,
      // Entities.CategoryEntity,
      Entities.MemberEntity,
      // Entities.MessageEntity,
      // Entities.PersonalMessageEntity,
      // Entities.PmAttachmentEntity,
      // Entities.PmRecipientEntity,
      // Entities.PollEntity,
      // Entities.PollChoiceEntity,
      // Entities.RelatedSubjectEntity,
      // Entities.TopicEntity,
    ]),
  ],
  providers: [
    UserService,
    PermissionService,
  ],
  exports: [
    UserService,
  ]
})
export class UserModule {}
