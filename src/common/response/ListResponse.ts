
export interface ListResponse<T> {
  entity: string
  options: {
    limit?: number,
    offset?: number,
  },
  allCount: number,
  count: number,
  list: T[],
  relations?: Record<string, Record<number, any>> // ToDo
}
export function listResponse<T>(
  data: {
    entity: string
    limit?: number,
    offset?: number,
    allCount?: number,
    list: T[],
    relations?: Record<string, Record<number, any>> // ToDo
  }
): ListResponse<T> {
  return {
    entity: data.entity,
    options: {
      limit: data.limit,
      offset: data.offset,
    },
    allCount: data.allCount ?? data.list.length,
    count: data.list.length,
    list: data.list,
    ...(data.relations ? {relations: data.relations} : {}),
  }
}
