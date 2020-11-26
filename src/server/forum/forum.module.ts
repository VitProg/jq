import { Module } from '@nestjs/common'
import { BoardModule } from './board/board.module'
import { TopicModule } from './topic/topic.module'
import { ForumCacheModule } from './forum-cache/forum-cache.module'
import { MessageModule } from './message/message.module'


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
