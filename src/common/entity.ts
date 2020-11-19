import { Entity as OrigEntity, EntityOptions } from 'typeorm'

export const Entity = (name?: string, options?: EntityOptions) => {
  const n = name ?? options?.name;
  if (n) {
    options.name = (process.env.TABLE_PREFIX ?? '') + n
  }
  return OrigEntity(options)
}
