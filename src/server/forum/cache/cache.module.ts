import { forwardRef, Inject, Module, OnModuleInit } from '@nestjs/common'
import { CacheService } from './cache.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BoardEntity, CategoryEntity } from '../../entities'
import { BoardModule } from '../board/board.module'


@Module({
  imports: [
    TypeOrmModule.forFeature([
      BoardEntity,
      CategoryEntity,
    ]),
    forwardRef(() => BoardModule),
  ],
  providers: [
    CacheService,
  ],
  exports: [
    CacheService,
  ],
})
export class CacheModule implements OnModuleInit {
  constructor (
    @Inject(forwardRef(() => CacheService)) private readonly cacheService: CacheService,
  ) {
  }

  async onModuleInit () {
    await this.cacheService.init()
  }
}
