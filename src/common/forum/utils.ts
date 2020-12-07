import { IUser } from './forum.interfaces'


export const getUserGroups = (user?: IUser): number[] => {
  const groups = [-1]

  if (user) {
    groups.push(0)
    groups.push(...user.groupIds)
  }

  return groups
}
