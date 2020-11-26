import { CacheModule, Module, Scope } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ForumModule } from './forum/forum.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { RedisModule, RedisService } from 'nestjs-redis'
import configuration from './config/configuration'
import { REDIS_CLIENT } from './di.symbols'
import { GlobalModule } from './global.module'


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRoot(),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('redis')!,
      inject: [ConfigService]
    }),
    CacheModule.register({
      ttl: 10,
      max: 100,
    }),
    ForumModule,
    AuthModule,
    UserModule,
    GlobalModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {


}
