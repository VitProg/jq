import { Controller, Get, Query } from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { WithFields } from './types'
import { between } from '../../../common/utils/number'
import { UserService } from './user.service'
import { splitPipedStrings } from '../../../common/utils/string'
import { ParseIntOptionalPipe } from '../../pipes/parse-int-optional.pipe'
import { ConfigService } from '@nestjs/config'
import { ApiQueryPagination } from '../../swagger/decorators/api-query-pagination'
import { ApiPipeStrings } from '../../swagger/decorators/api-pipe-strings'
import { MessageAllRelations } from '../../../common/forum/forum.entity-relations'
import { ParsePipedStringPipe } from '../../pipes/parse-piped-string.pipe'


const MAX_ITEMS_ON_PAGE = 200
const MIN_ITEMS_ON_PAGE = 5

@ApiTags('user')
@Controller('user')
export class UserController {
  readonly pageSize = parseInt(this.configService.get('FORUM_USER_PAGE_SIZE', '20'), 10)

  constructor (
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
  }

  @Get('active')
  @ApiQueryPagination()
  @ApiPipeStrings({
    name: 'with',
    where: 'query',
    enum: ['email', 'auth', 'permissions', 'groups'],
    required: false,
  })
  async activeUsers (
    @Query('page', new ParseIntOptionalPipe({min: 1})) page = 1,
    @Query('pageSize', new ParseIntOptionalPipe({min: MIN_ITEMS_ON_PAGE, max: MAX_ITEMS_ON_PAGE})) pageSize = this.pageSize,
    @Query('with', ParsePipedStringPipe) withFields: WithFields = ['groups']
  ) {
    console.log('withFields', withFields)
    return this.userService.getActiveUsers({
      limit: between(pageSize, MIN_ITEMS_ON_PAGE, MAX_ITEMS_ON_PAGE),
      page,
    }, withFields)
  }

}
