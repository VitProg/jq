import React, { FC } from 'react'
import { AppBar, Button, Link, Toolbar, Typography } from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import { useStore } from '../hooks/use-store'
import { HeaderForUser } from '../pages/auth/header/HeaderForUser'
import { HeaderForGuest } from '../pages/auth/header/HeaderForGuest'
import { RouteLink } from '../components/Route/RouteLink'


export const Header: FC = observer(function Header(props) {

  const { myStore } = useStore()
  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            <RouteLink to={'index'} component={Link} color="inherit">JQ Forum React</RouteLink>
          </Typography>
          <nav>
            <RouteLink to={'lastMessages'} component={Link} color="inherit">Сообщения</RouteLink>
          </nav>
          {/*<Button variant="outlined" color="primary" component={Link} to="/messages">*/}
          {/*  Last messages*/}
          {/*</Button>*/}
          {myStore.user ?
            <HeaderForUser user={myStore.user}/> :
            <HeaderForGuest/>
          }
        </Toolbar>
      </AppBar>
    </header>
  )
})

