import React, { FC, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { RouteLink } from '../../components/Route/RouteLink'
import { Button } from '@material-ui/core'


export const HeaderForGuest: FC = observer(function HeaderForGuest (props) {
  return (
    <>
      <RouteLink to={'registration'} component={Button} color="inherit">Зарегистрироваться</RouteLink>
      <RouteLink to={'login'} component={Button} color="inherit">Войти</RouteLink>
    </>
  )
})
