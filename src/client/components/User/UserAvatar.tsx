import React, { FC } from 'react'
import { User } from '../../../common/forum/models/user'
import { Avatar } from '@material-ui/core'
import { RouteLink } from '../Route/RouteLink'
import { observer } from 'mobx-react-lite'
import { store } from '../../store'


interface Props {
  user?: User
  withLink?: boolean
  onCLick?: (event: React.MouseEvent<HTMLElement>) => void
}


export const UserAvatar: FC<Props> = observer(function UserAvatar (props) {
  const {
    user,
    withLink = false,
    onCLick
  } = props

  if (user) {
    const avatar = store.configStore.getUserAvatarUrl(user)
    const latter = user.name.substr(0, 1)

    if (withLink) {
      return (
        <Avatar
          onClick={onCLick}
          alt={user.name}
          src={avatar}
          component={RouteLink as any}
          to={'user'}
          route={{ user }}
        >{latter}</Avatar>
      )
    }

    return (
      <Avatar
        onClick={onCLick}
        alt={user.name}
        src={avatar}
      />
    )
  }

  return (
    <Avatar
      onClick={onCLick}
      alt='?'
    >?</Avatar>
  )
})
