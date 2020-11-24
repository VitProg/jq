import { Gender } from '../../../common/forum/forum.constants'


export function timestampToDate (timestamp: number) {
  return timestamp ?
    new Date((timestamp + (3 * 3600)) * 1000) :
    undefined
}

export function toGender(gender: number): Gender {
  return gender === 1
    ? Gender.Male
    : (gender === 2
      ? Gender.Female
      : Gender.Unknown
    )
}
