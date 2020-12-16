import { Route } from 'type-route'
import { routes } from '.'
import { ReactElement } from 'react'
import { AnyObject, IfDefined, ObjectValues } from '../../common/utils/types'


export type AppRoute = Route<typeof routes>

export type ExtractRouteProps<R extends keyof typeof routes> = Parameters<(typeof routes)[R]>[0]
export type OptionalProps<R extends AnyObject | undefined> = IfDefined<R, {[K in keyof R]: R[K] | undefined}, undefined>

export type AppRouteKeys = keyof typeof routes
export type AppRouteKeysWithoutProps = ObjectValues<{[K in AppRouteKeys]: IfDefined<ExtractRouteProps<K>, never, K>}>
export type AppRouteKeysWithProps = ObjectValues<{[K in AppRouteKeys]: IfDefined<ExtractRouteProps<K>, never, K>}>

export interface IfRouteParams<N extends keyof typeof routes> {
  name: N,
  route: AppRoute | undefined,
  render: (route: Route<(typeof routes)[N]>) => ReactElement,
  guard?: (route: Route<(typeof routes)[N]>) => (undefined | boolean | Route<(typeof routes)>)
  saveRedirect?: boolean
}

