import React, { FC, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { UserAvatar } from '../../components/User/UserAvatar'
import { Menu, MenuItem } from '@material-ui/core'
import { User } from '../../../common/forum/entities/user'
import { RouteLink } from '../../components/Route/RouteLink'
import { useInjection } from '../../ioc/ioc.react'
import { ApiServiceSymbol } from '../../ioc/ioc.symbols'
import { IApiService } from '../../services/interfaces'


interface Props {
  user?: User
}

export const HeaderForUser: FC<Props> = observer(function HeaderForUser (props) {
  if (!props.user) {
    return null
  }

  const [menuOpened, setMenuOpened] = useState<null | HTMLElement>(null)
  const apiService = useInjection<IApiService>(ApiServiceSymbol)

  const handleAvatarClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (menuOpened) {
        setMenuOpened(null)
      } else {
        setMenuOpened(event.currentTarget)
      }
    },
    [menuOpened],
  )

  const handleMenuClose = () => {
    setMenuOpened(null)
  }

  const handleLogoutClick = async () => {
    handleMenuClose()
    await apiService.logout()
  }

  return (
    <div>
      <UserAvatar user={props.user} onCLick={handleAvatarClick}/>

      <Menu
        id="menu-appbar"
        anchorEl={menuOpened}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!!menuOpened}
        onClose={handleMenuClose}
      >
        <RouteLink to={'profile'} component={MenuItem} onClick={handleMenuClose}>Профиль</RouteLink>
        <RouteLink to={'settings'} component={MenuItem} onClick={handleMenuClose}>Настройки</RouteLink>
        <MenuItem onClick={handleLogoutClick}>Выход</MenuItem>
      </Menu>
    </div>
  )
})
