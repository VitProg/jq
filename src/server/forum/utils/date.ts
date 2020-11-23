
export function timestampToDate(timestamp: number) {
  return timestamp ?
    new Date((timestamp + (3 * 3600)) * 1000) :
    undefined
}
