
export const splitPipedStrings = <RA extends Array<any>> (
  str?: string,
  lowerCase: boolean = false,
  possibleValues?: RA,
): RA => {
  if (!str) {
    return [] as any
  }
  const s = (str ?? '').toString()

  const result = (lowerCase ? s.toLowerCase() : s)
    .split(/[^\w]/)
    .filter(Boolean)

  return possibleValues ?
    result.filter(i => possibleValues.includes(i as any)) as any :
    result
}


export const splitPipedNumbers = (ids?: string): number[] => {
  if (!ids) {
    return []
  }
  return ids.split(/[^\d]/).filter(Boolean).map<number>(id => parseInt(id, 10))
}
