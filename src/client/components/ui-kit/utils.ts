

export const joinClassNames = (...classNames: (string | undefined | null)[]) => {
  return classNames
    .filter(Boolean)
    .join(' ')
}

export const joinClassNamesMass =
  <T extends Record<string, string>, K extends keyof T>(classNamesMap1: T, classNamesMap2: Partial<T>): T => {
    const result: any = {}
    for (const [k, v] of Object.entries(classNamesMap1)) {
      result[k as any] = joinClassNames(v, classNamesMap2[k])
    }
    return result
  }
