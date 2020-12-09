import { IUser } from './forum.interfaces'


export const getUserGroups = (user?: IUser): number[] => {
  const groups = [-1]

  if (user) {
    groups.push(0)
    groups.push(...user.settings.groupIds)
  }

  return groups
}


const slugUrlRule = /([\w\d-_]+)-(\d+)/
export const serializeUrlSlugId = (value: {id: number, url: string} | undefined) => {
  if (!value) {
    return undefined
  }
  return `${value.url}-${value.id}`
}

export const deserializeUrlSlugId = (raw: string | undefined): {id: number, url: string} | undefined=> {
  if (!raw) {
    return undefined
  }
  const match = slugUrlRule.exec(raw)
  if (match && match.length === 3) {
    const id = parseInt(match[2])
    const url = match[1]
    if (id > 0 && url) {
      return {
        id,
        url,
      }
    }
  }
  return undefined
}
