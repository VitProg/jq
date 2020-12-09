import { Module } from '@nestjs/common'
import { BoardController } from './board.controller'
import { ForumCacheModule } from '../forum-cache/forum-cache.module'
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import * as Entities from '../../../../entities'
import { MessageModule } from '../message/message.module'
import { CategoryModule } from '../category/category.module'
import { TopicModule } from '../topic/topic.module'


@Module({
  imports: [
    TypeOrmModule.forFeature([
        Entities.BoardEntity,
    ]),
    ForumCacheModule,
    MessageModule,
    CategoryModule,
    TopicModule,
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {
}
