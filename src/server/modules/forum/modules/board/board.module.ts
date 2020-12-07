import { Module } from '@nestjs/common'
import { BoardController } from './board.controller'
import { ForumCacheModule } from '../forum-cache/forum-cache.module'
import { BoardService } from './board.service';


@Module({
  imports: [ForumCacheModule],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {
}
