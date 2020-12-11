import { ApiProperty } from '@nestjs/swagger'


export class GetDynamicDataTdo {
  @ApiProperty()
  ids!: number[]

  @ApiProperty()
  withUser?: boolean
}
