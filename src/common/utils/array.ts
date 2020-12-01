
export const arraysDiff = <A extends any, B extends any>(arrayA: A[], arrayB: B[]): Array<A | B> => {
  return (arrayA as any[])
    .filter(x => !arrayB.includes(x))
    .concat((arrayB as any[])
      .filter(x => !arrayA.includes(x))
    )
}

export const arraysIsEquals = <A extends any, B extends any>(arrayA: A[], arrayB: B[]) => arraysDiff(arrayA, arrayB).length === 0
