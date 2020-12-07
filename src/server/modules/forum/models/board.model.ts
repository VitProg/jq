import { IBoard, ICategory } from '../../../../common/forum/forum.interfaces'
import { ApiProperty } from '@nestjs/swagger'
import { CategoryModel } from './category.model'


export class BoardModel implements IBoard {
  @ApiProperty()
  id!: number

  @ApiProperty()
  url!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  description!: string

  @ApiProperty()
  forGroups?: number[]

  @ApiProperty()
  order!: number

  @ApiProperty()
  linksId!: {
    parent: number
    category: number
  }

  @ApiProperty()
  parent?: BoardModel
}
