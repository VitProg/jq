export type AnyObject = Record<keyof object, any>


export type ArrayValues<obj extends any[]> =
  obj[number];

export type UnionToIntersection<Union> =
  (Union extends any ? (x: Union) => void : never) extends ((x: infer intersection) => void)
    ? intersection
    : never;


export function omit<R extends AnyObject, Keys extends Array<keyof R>>(record: R, ...omitKeys: Keys): Omit<R, ArrayValues<Keys>> {
  const out = {}
  const keys = Object.keys(record).filter(key => !omitKeys.includes(key as any))
  for (const key of keys) {
    out[key] = record[key]
  }
  return out as any
}

export function pick<R extends AnyObject, Keys extends Array<keyof R>>(record: R, ...omitKeys: Keys): Pick<R, ArrayValues<Keys>> {
  const out = {}
  const keys = Object.keys(record).filter(key => omitKeys.includes(key as any))
  for (const key of keys) {
    out[key] = record[key]
  }
  // for (const key of Object.keys(record)) {
  //   console.log(typeof key)
  // }
  return out as any
}
