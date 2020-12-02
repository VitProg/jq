import React, { FC } from 'react'
import { IndexPage } from './pages/Index.page'
import { LastMessagesPage } from './pages/LastMessages.page'
import { LoginModal } from './pages/auth/LoginModal'
import { ProfilePage } from './pages/my/Profile.page'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import { store } from './store'
import { IRouteStore } from './store/types'
import { routerSession, routes } from './routing'
import { ifRoute } from './routing/utils'


export const RouterSwitch: FC = observer(function RouterSwitch () {
  console.log('!!!', toJS(store.routeStore.current))

  const onModalClose = (rs: IRouteStore) => {
    if (rs.noModalRoute?.href) {
      routerSession.replace(rs.noModalRoute.href)
    } else {
      if (rs.last) {
        rs.back()
      } else {
        rs.replace(routes.index())
      }
    }
  }

  // todo add command to refresh page component

  return (
    <>
      {/* MODALS */}

      {store.routeStore.isModal && ifRoute({
        name: 'login',
        route: store.routeStore.current,
        guard: r => !store.userStore.isAuth,
        render: route => <LoginModal isOpen={true} onClose={() => onModalClose(store.routeStore)}/>,
      })}
      {/*{isModal && ifRoute('registration', route, route => <RegistrationModal isOpen={true} onClose={onModalClose}/>)}*/}

      {/* PAGES */}

      {ifRoute({
        name: 'index',
        route: store.routeStore.noModalRoute,
        render: route => <IndexPage/>,
      })}

      {ifRoute({
        name: 'lastMessages',
        route: store.routeStore.noModalRoute,
        render: route => <LastMessagesPage page={route.params.page ?? 1}/>,
      })}

      {ifRoute({
        name: 'profile',
        route: store.routeStore.noModalRoute,
        guard: r => store.userStore.isAuth ? true : routes.login(),
        saveRedirect: true,
        render: route => <ProfilePage/>,
      })}

    </>
  )
})
