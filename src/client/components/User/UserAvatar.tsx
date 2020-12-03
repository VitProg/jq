import React, { FC } from 'react'
import { User } from '../../../common/forum/models/user'
import { Avatar, Badge, createStyles, Theme, withStyles } from '@material-ui/core'
import { ForumConfiguration } from '../../../common/forum/forum.constants'
import { RouteLink } from '../Route/RouteLink'

interface Props {
  user?: User
  withLink?: boolean
  onCLick?: (event: React.MouseEvent<HTMLElement>) => void
}


export const UserAvatar: FC<Props> = (props) => {
  const {
    user,
    withLink = false,
    onCLick
  } = props

  if (user) {
    const avatar = user.avatarUrl
    const latter = user.name.substr(0, 1)

    if (withLink) {
      return (
        <Avatar
          onClick={onCLick}
          alt={user.name}
          src={avatar}
          component={RouteLink as any}
          to={'user'}
          route={{user}}
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
      alt=''
      src={ForumConfiguration.defaultAvatar}
    />
  )
}
