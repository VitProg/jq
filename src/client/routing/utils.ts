import { StoredRoute } from '../store/types'
import { Route } from 'type-route'
import { isObject } from '../../common/type-guards'
import { store } from '../store'
import { modalRoutes, routes } from '.'
import { IfRouteParams } from './types'


export const isModalRoute = (route: StoredRoute | string) => {
  const name = typeof route === 'string' ? route : route?.name
  return modalRoutes.includes(name as any)
}

export const isRoute = <N extends keyof typeof routes = keyof typeof routes>(val: any, route?: N): val is Route<(typeof routes)[N]> => {
  if (!val || !isObject(val)) {
    return false
  }
  if (route) {
    return (val as Route<any>)?.name === route
  }

  return 'name' in val &&
    'params' in val &&
    'href' in val &&
    'link' in val
}

export const ifRoute = <N extends keyof typeof routes>({name, route, render, guard, saveRedirect}: IfRouteParams<N>) => {
  if (route && route.name === name) {
    if (guard) {
      const guardCheck = guard(route as any)

      if (!guardCheck) {
        return null
      }

      if (isRoute(guardCheck)) {
        if (!!saveRedirect) {
          store.routeStore.setSaved(route)
        }
        route.replace()
        // store.routeStore.replace(guardCheck)
        return null
      }
    }

    return render(route as any)
  }

  return null
}
