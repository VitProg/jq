import React, { FC, ReactHTMLElement } from 'react'
import { User } from '../../common/forum/entities/user'
import { Avatar, ListItemAvatar } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import { ForumConfiguration } from '../../common/forum/forum.constants'
import { isExternalLink } from '../../common/utils/links'
import styled from 'styled-components'

const StyledLink = styled.a`
  text-decoration: none;
  
  &:hover, &:active, &:focus {
    text-decoration: none;
  }
`

export const UserAvatar: FC<{user?: User, withLink: boolean}> = ({user, withLink = true}) => {

  if (user) {
    const avatar = user.avatarUrl ?? ForumConfiguration.defaultAvatar

    if (isExternalLink(user.link)) {
      return (
        <StyledLink href={user.link} target='_blank'><Avatar alt={user.name} src={avatar}/></StyledLink>
      )
    }

    return (
      <Avatar alt={user.name} src={avatar} component={RouterLink} to={user.link}/>
    )
  }

  return <Avatar alt='' src={ForumConfiguration.defaultAvatar}/>
}
