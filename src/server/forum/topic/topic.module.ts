import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import * as Entities from '../../entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Entities.RelatedSubjectEntity,
      Entities.TopicEntity,
    ]),
  ],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
