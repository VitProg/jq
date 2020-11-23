import { Module, OnModuleInit } from '@nestjs/common'
import { ForumService } from './forum.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheService } from './cache/cache.service';
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
    CacheService,
  ],
  exports: [
    ForumService,
  ]
})
export class ForumModule implements OnModuleInit {
  constructor (
    private readonly cacheService: CacheService,
  ) {
  }

  async onModuleInit () {
    await this.cacheService.init()
  }
}
