import { Route } from 'type-route'
import { routes } from '.'
import { StoredRoute } from '../store/types'
import { ReactElement } from 'react'

export type AppRoute = Route<typeof routes>

export type ExtractRouteProps<R extends keyof typeof routes> = Parameters<(typeof routes)[R]>[0]

export type AppRouteKeys = keyof typeof routes

export interface IfRouteParams<N extends keyof typeof routes> {
  name: N,
  route: AppRoute | undefined,
  render: (route: Route<(typeof routes)[N]>) => ReactElement,
  guard?: (route: Route<(typeof routes)[N]>) => (undefined | boolean | Route<(typeof routes)>)
  saveRedirect?: boolean
}
