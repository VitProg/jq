import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ForumModule } from './forum/forum.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import configuration from './config/configuration'
import { GlobalModule } from './global.module'
import { SecureModule } from './secure/secure.module';
import { MyModule } from './my/my.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    AuthModule,
    TypeOrmModule.forRoot(),
    ForumModule,
    UserModule,
    GlobalModule,
    SecureModule,
    MyModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    // AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TestInterceptor,
    // }
  ],
})
export class AppModule {


}
