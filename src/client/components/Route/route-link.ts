import { ExtractRouteProps, routes } from '../../routes'
import { AnyObject } from '../../../common/utils/object'
import { ReactNode } from 'react'


type types = 'simple' | 'mui-link' | 'mui-button'
type IfDefinedProps<Check, True, False = never> = Check extends AnyObject ? True : False

type ExtractProps<R extends keyof typeof routes> = IfDefinedProps<
  ExtractRouteProps<R>,
  {
    route: ExtractRouteProps<R>
  }
>

function routeLink<R extends keyof typeof routes, >(type: types, to: R, props: IfDefinedProps<ExtractRouteProps<R>, ExtractRouteProps<R>, never>): any;
function routeLink (type: types, to: any, props?: any): any {
  //todo
}


