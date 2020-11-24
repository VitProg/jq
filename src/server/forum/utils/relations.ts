
export function stringToRelationsArray<RA extends Array<any>>(str: string, relations: RA): RA {
  return (str ?? '').toString()
    .split(',')
    .map(i => i.trim().toLowerCase())
    .filter(i => relations.includes(i as any)) as any
}
