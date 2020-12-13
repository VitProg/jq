import { Module } from '@nestjs/common';
import { ToRedisService } from './to-redis.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { entitiesList } from '../../../entities/list'
import { ConsoleModule } from 'nestjs-console'

@Module({
  imports: [
    ConsoleModule,
    TypeOrmModule.forFeature(entitiesList),
  ],
  providers: [ToRedisService],
  exports: [ToRedisService],
})
export class ToRedisModule {}
