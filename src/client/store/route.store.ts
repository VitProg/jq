import { IRootStore, IRouteStore, StoredRoute } from './types'
import { action, computed, makeAutoObservable, observable } from 'mobx'
import { isModalRoute } from '../routing/utils'
import { routerSession } from '../routing'
import { AppRoute } from '../routing/types'


const HISTORY_LENGTH = 20

const asAppRoute = (route: StoredRoute): AppRoute => route as AppRoute

export class RouteStore implements IRouteStore {
  constructor () {
    makeAutoObservable(this, {
      history: observable,
      saved: observable,

      current: computed,
      isModal: computed,
      last: computed,
      noModalRoute: computed,

      push: action.bound,
      clearSaved: action.bound,
      setSaved: action.bound,
      handleRouter: action.bound,
      save: action.bound,
    })

    this.save(routerSession.getInitialRoute())
    routerSession.listen(this.handleRouter)
  }

  history: StoredRoute[] = []
  saved: StoredRoute | undefined = undefined

  handleRouter (route: AppRoute): void {
    //todo синхронизировать историю согласно route.action = 'pop' | 'replace' | 'push'
    this.save(route)
  }

  clearSaved (): void {
    this.saved = undefined
  }

  setSaved (route: AppRoute): void {
    this.saved = route
  }

  pushSaved(): void {
    if (this.saved) {
      this.push(this.saved)
      this.clearSaved()
    }
  }

  replaceSaved(): void {
    if (this.saved) {
      this.replace(this.saved)
      this.clearSaved()
    }
  }


  save (route: AppRoute | StoredRoute) {
    this.history = [
      route,
      ...this.history,
    ].slice(0, HISTORY_LENGTH)
  }

  get current () {
    return this.history.length > 0 ? this.history[0] : undefined
  }

  get last () {
    return this.history.length > 1 ? this.history[1] : undefined
  }

  get isModal () {
    return this.current ? isModalRoute(this.current) : false
  }

  get noModalRoute () {
    return this.history.find(r => !isModalRoute(r))
  }

  push (current: StoredRoute): void {
    if (!this.last || this.last.href !== current.href) {
      asAppRoute(current).push()
    }
  }

  back (): void {
    routerSession.back()
  }

  reload (): void {
    // ToDo
    // session.
  }

  replace (route: StoredRoute): void {
    this.history = this.history.slice(1)
    asAppRoute(route).replace()
  }
}
