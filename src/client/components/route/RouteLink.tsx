import { DOMAttributes, HTMLAttributes, ReactElement, ReactNode, useCallback } from 'react'
import { preventDefaultLinkClickBehavior } from 'type-route'

import { Button, Link, MenuItem } from '@material-ui/core'
import { isFunction } from '../../../common/type-guards'
import { OverridableComponent } from '@material-ui/core/OverridableComponent'
import { AppRouteKeys, ExtractRouteProps } from '../../routing/types'
import { routes } from '../../routing'
import { AnyObject } from '../../../common/utils/types'


const a = document.createElement('a')

type Types = typeof Button | typeof Link | typeof MenuItem | 'a'

type IfDefinedProps<Check, True, False = never> = Check extends undefined ? False : True

type GenerateProps<R extends AppRouteKeys,
  T extends Types = 'a'> =
  {
    component?: T
    // children?: ReactNode | ((props: ExtractRouteProps<R>) => ReactNode)
    // pagination?: PaginationRenderItemParams
    to: R
  } &
  IfDefinedProps<ExtractRouteProps<R>,
    {
      children?: ReactNode | ((p: NonNullable<ExtractRouteProps<R>>) => ReactNode)
      route: ExtractRouteProps<R>
    },
    {
      children?: ReactNode | (() => ReactNode)
    }> &
  (
    T extends OverridableComponent<infer F> ? Omit<F['props'], 'component'> & DOMAttributes<F> : (
      T extends 'a' ? HTMLAttributes<HTMLAnchorElement> : {
        onClick?: (event: MouseEvent) => void
      })
    )


export const RouteLink = <R extends AppRouteKeys, T extends Types = 'a', > (
  props: GenerateProps<R, T>
): ReactElement<GenerateProps<R, T>> => {

  if (!props) {
    return null as any
  }
  const { to, component = Link, route: toProps, ...componentProps } = props as typeof props & { route: any }

  const route = routes[to](toProps)

  const onClick = (event: MouseEvent) => {
    if ((props as any).onClick) {
      (props as any).onClick(event as any)
    }
    if (preventDefaultLinkClickBehavior(event)) {
      route.push()
    }
  }

  const children = isFunction(props.children) ? props.children(toProps) : props.children

  switch (component) {
    case Link: {
      return (
        <Link
          {...componentProps as any}
          href={route.href}
          onClick={onClick}
        >{children}</Link>
      )
    }

    case Button: {
      return (
        <Button
          {...componentProps as any}
          onClick={onClick}
        >{children}</Button>
      )
    }

    case MenuItem: {
      return (
        <MenuItem
          {...componentProps as any}
          onClick={onClick}
        >{children}</MenuItem>
      )
    }

    default: {
      return (
        <a
          {...componentProps as any}
          href={route.href}
          onClick={onClick}
        >{children}</a>
      )
    }
  }
}
