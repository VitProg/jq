
export function between(value: number, min: number, max: number) {
  return Math.max(min, Math.max(min, value))
}
