import { CacheInterceptor, CacheTTL, Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { CategoryService } from './category.service'
import { CategoryModel } from '../../models/category.model'
import { ApiPipeNumbersParam } from '../../../../swagger/decorators/api-pipe-numbers-param'


const DEVELOPMENT = process.env.NODE_ENV !== 'production'

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor (
    private readonly categoryService: CategoryService
  ) {
  }

  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(DEVELOPMENT ? 5 : 60)
  @Get()
  async findAll (): Promise<CategoryModel[]> {
    return this.categoryService.findAll()
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(DEVELOPMENT ? 5 : 60)
  @Get(':id')
  @ApiQuery({ name: 'id', type: Number })
  async findOne (@Param('id') id: string): Promise<CategoryModel | undefined> {
    return this.categoryService.findOne(+id)
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(DEVELOPMENT ? 5 : 60)
  @Get('many/:ids')
  @ApiPipeNumbersParam('ids')
  async findByIds (@Param('ids') ids: string): Promise<CategoryModel[]> {
    const idArray = ids.split(/[^\d]/).filter(Boolean).map<number>(id => parseInt(id, 10))
    return this.categoryService.findByIds(idArray)
  }
}
