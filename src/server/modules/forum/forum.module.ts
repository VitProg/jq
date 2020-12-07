import { Module } from '@nestjs/common'
import { BoardModule } from './modules/board/board.module'
import { TopicModule } from './modules/topic/topic.module'
import { ForumCacheModule } from './modules/forum-cache/forum-cache.module'
import { MessageModule } from './modules/message/message.module'
import { CategoryModule } from './modules/category/category.module';



@Module({
  imports: [
    ForumCacheModule,
    BoardModule,
    MessageModule,
    TopicModule,
    CategoryModule,
  ],
  exports: [
    BoardModule,
    MessageModule,
    TopicModule,
  ],
})
export class ForumModule {
}
