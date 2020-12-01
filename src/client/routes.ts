import { createRouter, defineRoute, noMatch, param, Route, ValueSerializer } from 'type-route'
import { User } from '../common/forum/entities/user'
import { ReactElement, useEffect, useState } from 'react'

// export enum RouteNames {
//   index = 'index',
//   lastMessages = 'lastMessages',
//   user = 'user',
//   profile = 'profile',
//   login = 'login',
//   registration = 'registration',
// }

const route = (...route: string[]) => route.length > 0 ? `/${route.join('/')}` : ''

const userUrlRule = /(\d+)-([\w\d-_]+)/
const userUrl: ValueSerializer<{userId: number, loginUrl: string} | User> = {
  parse (raw: string) {
    const match = userUrlRule.exec(raw)
    if (match && match.length === 3) {
      const userId = parseInt(match[1])
      const loginUrl = match[2]
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
      `${value.userId}-${value.loginUrl}` :
      `${value.id}-${value.slug}`
  },
}

const router = createRouter({
  index: defineRoute('/'),
  login: defineRoute('/login'),
  registration: defineRoute('/registration'),
  lastMessages: defineRoute(
    {
      page: param.path.optional.number,
    },
    p => route('last-messages', p.page)
  ),
  user: defineRoute(
    {
      user: param.path.ofType(userUrl),
    },
    p => route('user', p.user)
  ),
  profile: defineRoute('/profile'),
  settings: defineRoute('/settings'),
})

export const modalRoutes = [
  'login' as const,
  'registration' as const
]

export const isModalRoute = (route: AppRoute | string) => {
  const name = typeof route === 'string' ? route : route?.name
  return modalRoutes.includes(name as any)
}

export type ExtractRouteProps<R extends keyof typeof routes> = Parameters<(typeof routes)[R]>[0]

export const {
  RouteProvider,
  useRoute,
  routes,
  session
} = router

export const useRouteHistory = (historyLength = 20) => {
  const current = useRoute()

  const [history, setHistory] = useState<AppRoute[]>([])
  const [noModalRoute, setNoModalRoute] = useState<AppRoute | undefined>(isModalRoute(current) ? undefined : current)
  const [lastRoute, setLastRoute] = useState<AppRoute | undefined>()
  const [isModal, setIsModal] = useState<boolean>(isModalRoute(current))

  useEffect(() => {
    const last = history?.[0]

    setLastRoute(last)

    if (!last || last.href !== current?.href) {
      const newRoutes = [
        { ...current },
        ...history,
      ].slice(0, 20)

      setHistory(newRoutes)
      setNoModalRoute(newRoutes.find(r => !isModalRoute(r)))
      setIsModal(isModalRoute(current))
    }
  }, [current])

  return {
    route: current,
    history,
    noModalRoute,
    lastRoute,
    isModal,
  }

}

export type AppRoute = Route<typeof routes>

export const ifRoute = <N extends keyof typeof routes>(name: N, route: AppRoute | undefined, callback: (route: Route<(typeof routes)[N]>) => ReactElement) => {
  if (route && route.name === name) {
    return callback(route as any)
  }
  return null
}
