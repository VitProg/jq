import { noMatch, ValueSerializer } from 'type-route'
import { User } from '../../../common/forum/models/user'


const userUrlRule = /([\w\d-_]+)-(\d+)/
export const userSerializer: ValueSerializer<{userId: number, loginUrl: string} | User> = {
  parse (raw: string) {
    const match = userUrlRule.exec(raw)
    if (match && match.length === 3) {
      const userId = parseInt(match[2])
      const loginUrl = match[1]
      if (userId > 0 && loginUrl) {
        return {
          userId,
          loginUrl
        }
      }
    }
    return noMatch
  },
  stringify (value: {userId: number, loginUrl: string} | User): string {
    return 'userId' in value ?
      `${value.loginUrl}-${value.userId}` :
      `${value.slug}-${value.id}`
  },
}
