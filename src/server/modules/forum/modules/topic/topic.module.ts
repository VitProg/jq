import { forwardRef, Module } from '@nestjs/common'
import { TopicService } from './topic.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TopicController } from './topic.controller'
import * as Entities from '../../../../entities'
import { BoardModule } from '../board/board.module'
import { CategoryModule } from '../category/category.module'
import { MessageModule } from '../message/message.module'
import { UserModule } from '../../../user/user.module'


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Entities.RelatedSubjectEntity,
      Entities.RelatedSubjectEntity,
      Entities.TopicEntity,
    ]),
    forwardRef(() => BoardModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => MessageModule),
    forwardRef(() => UserModule),
  ],
  providers: [TopicService],
  exports: [TopicService],
  controllers: [TopicController],
})
export class TopicModule {
}
