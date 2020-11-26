import { Global, Module } from '@nestjs/common'
import { REDIS_CLIENT } from './di.symbols'
import { RedisService } from 'nestjs-redis'

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [RedisService],
      useFactory: (redisService: RedisService) => redisService.getClient(),
    }
  ],
  exports: [
    REDIS_CLIENT,
  ]
})
export class GlobalModule {

}
