import { Module } from '@nestjs/common';
import { ForumService } from './forum.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as Entities from '../entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Entities.AttachmentEntity,
      Entities.BoardEntity,
      Entities.CategoryEntity,
      Entities.MemberEntity,
      Entities.MessageEntity,
      Entities.PersonalMessageEntity,
      Entities.PmAttachmentEntity,
      Entities.PmRecipientEntity,
      Entities.PollEntity,
      Entities.PollChoiceEntity,
      Entities.RelatedSubjectEntity,
      Entities.TopicEntity,
    ])
  ],
  providers: [
    ForumService,
  ],
  exports: [
    ForumService,
  ]
})
export class ForumModule {}
