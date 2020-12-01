import React, { FC } from 'react'
import { User } from '../../../common/forum/entities/user'
import { Avatar } from '@material-ui/core'
import { ForumConfiguration } from '../../../common/forum/forum.constants'
import styled from 'styled-components'
import { RouteLink } from '../Route/RouteLink'


const StyledLink = styled.a`
  text-decoration: none;

  &:hover, &:active, &:focus {
    text-decoration: none;
  }
`

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
    const avatar = user.avatarUrl ?? ForumConfiguration.defaultAvatar

    if (withLink) {
      return (
        <Avatar
          // component={RouteLink}
          onClick={onCLick}
          alt={user.name}
          src={avatar}
          // to={'user'}
          // props={{
          //   user: {
          //     userId: user.id,
          //     loginUrl: user.slug
          //   }
          // }}
        />
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
