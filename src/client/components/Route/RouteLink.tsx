import React, { DOMAttributes, HTMLAttributes, ReactElement, ReactNode, useCallback } from 'react'
import { preventDefaultLinkClickBehavior } from 'type-route'
import { ExtractRouteProps, routes } from '../../routes'
import { Button, Link, MenuItem } from '@material-ui/core'
import { AnyObject } from '../../../common/utils/object'
import { isFunction } from '../../../common/type-guards'
import { OverridableComponent } from '@material-ui/core/OverridableComponent'


const a = document.createElement('a')

// type types = 'simple' | 'mui-link' | 'mui-button'
type Types = typeof Button | typeof Link | typeof MenuItem | 'a'
type DefaultType = typeof HTMLAnchorElement

type IfDefinedProps<Check, True, False = never> = Check extends AnyObject ? True : False


type GenerateProps<R extends keyof typeof routes,
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
        onClick?: (event: React.MouseEvent) => void
      })
    )


export const RouteLink = <R extends keyof typeof routes, T extends Types = 'a', > (
  props: GenerateProps<R, T>
): ReactElement<GenerateProps<R, T>> => {

  if (!props) {
    debugger
  }
  const { to, component = 'mui-link', route: toProps, ...componentProps } = props as typeof props & { route: any }

  const route = routes[to](toProps)

  const onClick = useCallback((event: React.MouseEvent) => {
    if ((props as any).onClick) {
      (props as any).onClick(event as any)
    }
    if (preventDefaultLinkClickBehavior(event)) {
      route.push()
    }
  }, [to, (props as any).onClick])

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
