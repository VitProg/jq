import { IBoard, ICategory } from '../../../../common/forum/forum.interfaces'
import { ApiProperty } from '@nestjs/swagger'


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
  linksId!: {
    category: number
  }

  @ApiProperty()
  category?: {
    id: number
    name: string
    order: number
  }
}
