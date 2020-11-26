import { CacheModule, Global, Module } from '@nestjs/common'
import { REDIS_CLIENT } from './di.symbols'
import { RedisModule, RedisService } from 'nestjs-redis'
import { ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-ioredis'

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('redis')!,
      inject: [ConfigService]
    }),

    CacheModule.registerAsync({
      useFactory: (configService: ConfigService) => (
        {
          store: redisStore,

          ...configService.get('redis'),

          ttl: 10,
          // max: 1000,
        }
      ),
      inject: [ConfigService]
    }),
  ],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [RedisService],
      useFactory: (redisService: RedisService) => redisService.getClient(),
    },
  ],
  exports: [
    RedisModule,
    REDIS_CLIENT,
    CacheModule,
  ]
})
export class GlobalModule {

}
