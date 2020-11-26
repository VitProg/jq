import { RedisService } from 'nestjs-redis'


export type RedisClient = ReturnType<RedisService['getClient']>
