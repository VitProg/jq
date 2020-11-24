import { forwardRef, Inject, Module, OnModuleInit } from '@nestjs/common'
import { CacheService } from './cache/cache.service'
import { BoardModule } from './board/board.module'
import { TopicModule } from './topic/topic.module'
import { CacheModule } from './cache/cache.module'
import { MessageModule } from './message/message.module'


@Module({
  imports: [
    // CacheModule,
    BoardModule,
    MessageModule,
    TopicModule,
  ],
  exports: [
    BoardModule,
    MessageModule,
    TopicModule,
  ]
})
export class ForumModule {
}
