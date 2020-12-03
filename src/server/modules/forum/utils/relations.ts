
export function stringToParams<RA extends Array<any>>(str: string, possibleValues?: RA): RA {
  const result = (str ?? '').toString()
    .split(',')
    .map(i => i.trim().toLowerCase())

  return possibleValues ?
    result.filter(i => possibleValues.includes(i as any)) as any :
    result
}
