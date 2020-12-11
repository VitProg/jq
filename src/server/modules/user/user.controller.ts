import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common'
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger'
import { WithFields } from './types'
import { between } from '../../../common/utils/number'
import { UserService } from './user.service'
import { ParseIntOptionalPipe } from '../../pipes/parse-int-optional.pipe'
import { ConfigService } from '@nestjs/config'
import { ApiQueryPagination } from '../../swagger/decorators/api-query-pagination'
import { ApiPipeStrings } from '../../swagger/decorators/api-pipe-strings'
import { ParsePipedStringPipe } from '../../pipes/parse-piped-string.pipe'
import { User } from '../auth/decorators/user'
import { UserManyResponse } from '../forum/modules/responses/user-many.response'
import { WithUser } from '../auth/decorators/with-user'
import { ApiPipeNumbers } from '../../swagger/decorators/api-pipe-numbers'
import { ParsePipedIntPipe } from '../../pipes/parse-piped-int.pipe'
import { UserModel } from './models/user.model'
import { FindByNameDto } from './dto/find-by-name.dto'


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
    @Query('page', new ParseIntOptionalPipe({ min: 1 })) page = 1,
    @Query('pageSize', new ParseIntOptionalPipe({
      min: MIN_ITEMS_ON_PAGE,
      max: MAX_ITEMS_ON_PAGE
    })) pageSize = this.pageSize,
    @Query('with', ParsePipedStringPipe) withFields: WithFields = ['groups']
  ) {
    console.log('withFields', withFields)
    return this.userService.getActiveUsers({
      limit: between(pageSize, MIN_ITEMS_ON_PAGE, MAX_ITEMS_ON_PAGE),
      page,
    }, withFields)
  }

  @Get('')
  @ApiQueryPagination()
  async findAll (
    @Query('page', new ParseIntOptionalPipe({ min: 1 })) page = 1,
    @Query('pageSize', new ParseIntOptionalPipe({ min: 5 })) pageSize = this.pageSize,
    @User() user?: UserModel,
  ): Promise<UserManyResponse> {
    return this.userService.paginate({
      pagination: { page, limit: pageSize },
    })
  }

  @WithUser()
  @Post('by-name')
  @ApiBody({ type: FindByNameDto })
  async findByName (
    @Body() dto: FindByNameDto,
    @User() user?: UserModel
  ): Promise<UserModel[]> {
    return this.userService.findByName(dto.name)
  }

  @WithUser()
  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  async findById (
    @Param('id', ParseIntPipe) id: number,
    @User() user?: UserModel
  ): Promise<UserModel | undefined> {
    return this.userService.findById(id)
  }

  @WithUser()
  @Get('many/:ids')
  @ApiPipeNumbers('ids', 'param')
  async findByIds (
    @Param('ids', ParsePipedIntPipe) ids: number[],
    @User() user?: UserModel,
  ): Promise<UserModel[]> {
    return this.userService.findByIds(ids)
  }


}
