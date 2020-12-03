import { Module } from '@nestjs/common'
import { BoardModule } from './modules/board/board.module'
import { TopicModule } from './modules/topic/topic.module'
import { ForumCacheModule } from './modules/forum-cache/forum-cache.module'
import { MessageModule } from './modules/message/message.module'


@Module({
  imports: [
    ForumCacheModule,
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
