import { Module } from '@nestjs/common'
import { BoardService } from './board.service'
import { ForumCacheModule } from '../forum-cache/forum-cache.module'


@Module({
  imports: [ForumCacheModule],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {
}
