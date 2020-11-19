
export interface ListResponse<T> {
  entity: string
  options: {
    limit?: number,
    offset?: number,
  },
  count: number,
  list: T[],
}
export function listResponse<T>(
  data: {
    entity: string
    limit?: number,
    offset?: number,
    list: T[],
  }
): ListResponse<T> {
  return {
    entity: data.entity,
    options: {
      limit: data.limit,
      offset: data.offset,
    },
    count: data.list.length,
    list: data.list,
  }
}
