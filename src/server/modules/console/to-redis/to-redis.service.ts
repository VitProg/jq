import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BoardEntity, MessageEntity, TopicEntity } from '../../../entities'
import { Repository } from 'typeorm'
import { ConsoleService } from 'nestjs-console'
import { REDIS_CLIENT } from '../../../di.symbols'
import { RedisClient } from '../../../types'
import { UserLevel, userLevelsGroupIds } from '../../../../common/forum/forum.constants'
import { getUserLevelsByGroups } from '../../../../common/forum/utils'
import { toBoard, toBoardMap, toTopicMap } from '../../forum/utils/mapper'
import * as KEY from '../../../common/utils/redis'
import { TopicModel } from '../../forum/models/topic.model'


const MAX_LATEST_MESSAGES = 500
const MAX_LATEST_TOPICS = 500

@Injectable()
export class ToRedisService {
  constructor (
    private readonly consoleService: ConsoleService,
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
    @InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(TopicEntity) private readonly topicRepository: Repository<TopicEntity>,
    @InjectRepository(BoardEntity) private readonly boardRepository: Repository<BoardEntity>,
  ) {
    const cli = this.consoleService.getCli()

    const groupCommand = this.consoleService.createGroupCommand(
      {
        name: 'to-redis',
        description: 'Migrate some data to redis'
      },
      cli,
    )

    this.consoleService.createCommand(
      {
        command: 'convert',
        description: 'Convert DB from MySQL to Redis'
      },
      this.convert,
      groupCommand // attach the command to the group
    )
  }

  convert = async () => {
    const beginTime = Date.now()
    try {
      const inProcess = (await this.redis.get('converting-db')) !== null
      if (inProcess) {
        console.error('Another converting process is running, please wait or delete redis key "converting-db"')
      }
      console.log(await this.redis.pipeline()
        .set('db-converted', 0)
        .set('converting-db', 1)
        .exec())

      console.log('convert DB to redis')
      console.log(await this.redis.dbsize())

      const prefix = process.env.REDIS_PREFIX ?? ''

      const keys = await this.redis.keys(`${prefix}*`)
      console.log('clear redis db', await this.redis.del(...keys.map(k => k.substr(prefix.length))))

      console.log('convert boards')
      const boards = await this.boardRepository.find()
      const boardsMap = toBoardMap(boards)
      {
        for (const board of boards) {
          const boardModel = boardsMap.get(board.idBoard) ?? toBoard(board)
          const levels = getUserLevelsByGroups([...userLevelsGroupIds.admin, ...(boardModel.settings.forGroups ?? [])])

          for (const level of levels) {
            const key = KEY.getKeyBoardLevel(level)
            const keyLatest = KEY.getKeyBoardLatestLevel(level)

            await this.redis.zadd(key, board.boardOrder, board.idBoard)
            await this.redis.zadd(keyLatest, board.idLastMsg * -1, board.idBoard)
          }
        }
      }

      console.log('convert topics')
      const topics = await this.topicRepository.find({
        order: {
          idLastMsg: 'DESC'
        }
      })
      const topicMap = toTopicMap(topics as any)

      let countLatestTopics = 0

      for (const topic of topics) {
        const id: any = topic.idTopic
        const sortASC: any = topic.idLastMsg
        const sortDESC: any = topic.idLastMsg * -1
        const isApproved = !!topic.approved

        const boardModel = boardsMap.get(topic.idBoard)!
        if (!boardModel) {
          if (topic.idTopic > 0) {
            throw new Error(`board ${topic.idTopic} not found, for topic ${id}`)
          }
          continue
        }

        const levels = getUserLevelsByGroups([...userLevelsGroupIds.admin, ...(boardModel.settings.forGroups ?? [])])

        const pipeline = this.redis.pipeline()
        for (const level of levels) {
          if (isApproved || (!isApproved && [UserLevel.admin, UserLevel.moderator].includes(level))) {
            const key = KEY.getKeyTopicBoardLevel(boardModel.id, level)
            const keyLatest = KEY.getKeyTopicLatestLevel(level)

            pipeline.zadd(key, sortDESC, id)

            if (countLatestTopics < MAX_LATEST_TOPICS) {
              countLatestTopics++
              pipeline.zadd(keyLatest, sortDESC, id)
            }
          }
        }
        await pipeline.exec()
      }


      console.log('convert messages')
      let countLatestMessages = 0
      const PER_TURN = 5000
      let messages: MessageEntity[] = []
      let skip = 0
      const messagesCount = await this.messageRepository.count()
      while (true) {
        console.log('...load messages', skip, PER_TURN, messagesCount)
        messages = await this.messageRepository.find({
          order: {
            idMsg: 'DESC'
          },
          skip,
          take: PER_TURN,
        })
        skip += PER_TURN
        if (!messages || messages.length === 0) {
          break
        }
        for (const message of messages) {
          const topicModel = topicMap.get(message.idTopic)!
          if (!topicModel) {
            if (message.idTopic > 0) {
              throw new Error(`topic ${message.idTopic} not found, for message ${message.idMsg}`)
            }
            continue
          }

          const boardModel = boardsMap.get(message.idBoard)!
          if (!boardModel) {
            if (message.idBoard > 0) {
              throw new Error(`board ${message.idBoard} not found, for message ${message.idMsg}`)
            }
            continue
          }

          const isApproved = !!message.approved && topicModel.flags.isApproved

          const id: any = message.idMsg
          const timeASC: any = message.posterTime
          const timeDESC: any = message.posterTime * -1

          const levels = getUserLevelsByGroups([...userLevelsGroupIds.admin, ...(boardModel.settings.forGroups ?? [])])

          const pipeline = this.redis.pipeline();
          for (const level of levels) {
            if (isApproved || (!isApproved && [UserLevel.admin, UserLevel.moderator].includes(level))) {
              const keyLatest = KEY.getKeyMessageLatestLevel(level)
              const keyBoardASC = KEY.getKeyMessageBoardLevel(boardModel.id, level, 'asc')
              const keyBoardDESC = KEY.getKeyMessageBoardLevel(boardModel.id, level, 'desc')
              const keyBoardLatest = KEY.getKeyMessageBoardLatestLevel(boardModel.id, level)
              const keyTopicASC = KEY.getKeyMessageTopicLevel(topicModel.id, level, 'asc')
              const keyTopicDESC = KEY.getKeyMessageTopicLevel(topicModel.id, level, 'desc')

              pipeline.zadd(keyBoardASC, timeASC, id)
              pipeline.zadd(keyBoardDESC, timeDESC, id)
              pipeline.zadd(keyTopicASC, timeASC, id)
              pipeline.zadd(keyTopicDESC, timeDESC, id)

              if (countLatestMessages < MAX_LATEST_MESSAGES) {
                countLatestMessages++
                pipeline.zadd(keyLatest, timeDESC, id)
              }

              const countLatestMessageBoard = await this.redis.zcard(keyBoardLatest)
              if (countLatestMessageBoard < MAX_LATEST_MESSAGES) {
                pipeline.zadd(keyBoardLatest, timeDESC, id)
              }
            }
          }
          await pipeline.exec()
        }
      }
      console.log('completed!')
    } catch (e) {
      console.error(e)
    } finally {
      await this.redis.pipeline()
        .del('converting-db')
        .set('db-converted', 1)
        .exec()
      const endTime = Date.now()
      console.log((((endTime - beginTime) / 1000) / 60).toFixed(3), 'minutes')
      console.log('DB size:', await this.redis.dbsize())
    }

  }
}
