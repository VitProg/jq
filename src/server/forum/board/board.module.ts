import { Module } from '@nestjs/common'
import { BoardService } from './board.service'
import { CacheModule } from '../cache/cache.module'


@Module({
  imports: [CacheModule],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {
}
