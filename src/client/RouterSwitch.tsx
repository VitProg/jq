import React, { FC, useEffect, useState } from 'react'
import { IndexPage } from './pages/Index.page'
import { LastMessageListPage } from './pages/LastMessageList.page'
import { LoginModal } from './pages/auth/login-modal/LoginModal'
import { ProfilePage } from './pages/my/Profile.page'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import { store } from './store'
import { IRouteStore } from './store/types'
import { routerSession, routes } from './routing'
import { ifRoute } from './routing/utils'
import { RegistrationModal } from './pages/auth/registration-modal/RegistrationModal'
import { ForgotPasswordModal } from './pages/auth/forgot-password-modal/ForgotPasswordModal'
import { BoardListPage } from './pages/BoardList.page'
import { BoardTopicList } from './pages/BoardTopicList.page'
import { TopicMessageListPage } from './pages/TopicMessageList.page'


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
        guard: r => !store.myStore.isAuth,
        render: route => <LoginModal  isOpen={true} onClose={() => onModalClose(store.routeStore)}/>,
      })}

      {store.routeStore.isModal && ifRoute({
        name: 'registration',
        route: store.routeStore.current,
        guard: r => !store.myStore.isAuth,
        render: route => <RegistrationModal  isOpen={true} onClose={() => onModalClose(store.routeStore)}/>,
      })}

      {store.routeStore.isModal && ifRoute({
        name: 'forgotPassword',
        route: store.routeStore.current,
        guard: r => !store.myStore.isAuth,
        render: route => <ForgotPasswordModal isOpen={true} onClose={() => onModalClose(store.routeStore)}/>,
      })}

      {/* PAGES */}

      {ifRoute({
        name: 'index',
        route: store.routeStore.noModalRoute,
        render: route => <BoardListPage />,
      })}

      {ifRoute({
        name: 'lastMessages',
        route: store.routeStore.noModalRoute,
        render: route => <LastMessageListPage page={route.params.page ?? 1}/>,
      })}

      {ifRoute({
        name: 'boardTopicList',
        route: store.routeStore.noModalRoute,
        render: route => <BoardTopicList page={route.params.page ?? 1} board={route.params.board}/>,
      })}

      {ifRoute({
        name: 'topicMessageList',
        route: store.routeStore.noModalRoute,
        render: route => <TopicMessageListPage page={route.params.page ?? 1} topic={route.params.topic}/>,
      })}

      {ifRoute({
        name: 'profile',
        route: store.routeStore.noModalRoute,
        guard: r => store.myStore.isAuth ? true : routes.login(),
        saveRedirect: true,
        render: route => <ProfilePage />,
      })}

    </>
  )
})
