import { defineRoute, param } from 'type-route'
import { userSerializer } from './routing/serializers/user.serializer'

const resolve = (...route: string[]) => route.length > 0 ? `/${route.join('/')}` : ''

export const modalRoutes = [
  'login' as const,
  'registration' as const
]

export const definedRoutes = {
  index: defineRoute('/'),
  login: defineRoute('/login'),
  registration: defineRoute('/registration'),
  lastMessages: defineRoute(
    {
      page: param.path.optional.number,
    },
    p => resolve('last-messages', p.page)
  ),
  user: defineRoute(
    {
      user: param.path.ofType(userSerializer),
    },
    p => resolve('user', p.user)
  ),
  profile: defineRoute('/profile'),
  settings: defineRoute('/settings'),
}







