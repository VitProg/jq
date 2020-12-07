import { applyDecorators } from '@nestjs/common'
import { ApiParam, ApiQuery } from '@nestjs/swagger'


export const ApiPipeNumbersParam = (name: string): MethodDecorator => {
  return applyDecorators(
    ApiParam({
      name,
      style: 'pipeDelimited',
      schema: {
        type: 'array',
        items: { type: 'number' },
      }
    }),
  )
}

