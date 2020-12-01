import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useRoute, session, AppRoute, routes, useRouteHistory, isModalRoute, modalRoutes, ifRoute } from './routes'
import { IndexPage } from './pages/Index.page'
import { LastMessagesPage } from './pages/LastMessages.page'
import { LoginModal } from './pages/auth/LoginModal'
import { Keyboard } from '@material-ui/icons'
import { ArrayValues } from '../common/utils/object'
import { ProfilePage } from './pages/my/Profile.page'





export const RouterSwitch: FC = () => {
  const {
    route,
    lastRoute,
    noModalRoute,
    history,
    isModal,
  } = useRouteHistory()

  console.log('!!!', {
    route,
    lastRoute,
    noModalRoute,
    history,
    isModal,
  })

  const onModalClose = () => {
    debugger
    if (noModalRoute?.href) {
      session.replace(noModalRoute.href)
    } else {
      session.back()
    }
  }

  // todo add command to refresh page component

  return (
    <>
      {ifRoute('index', noModalRoute, route => <IndexPage/>)}
      {ifRoute('lastMessages', noModalRoute, route => <LastMessagesPage page={route.params.page ?? 1}/>)}
      {ifRoute('profile', noModalRoute, route => <ProfilePage/>)}

      {/*Modals*/}

      {isModal && ifRoute('login', route, route => <LoginModal isOpen={true} onClose={onModalClose}/>)}
      {/*{isModal && ifRoute('registration', route, route => <RegistrationModal isOpen={true} onClose={onModalClose}/>)}*/}
    </>
  )
}
