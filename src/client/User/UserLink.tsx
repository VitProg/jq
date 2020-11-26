import { User } from '../../common/forum/entities/user'
import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link, Typography, TypographyTypeMap } from '@material-ui/core'
import { isExternalLink } from '../../common/utils/links'


export const UserLink: FC<{ user?: User, color?: TypographyTypeMap['props']['color'] }> = (
  {
    user,
    color = 'primary',
    children,
  }
) => {
  const link = user?.link
  const isOut = isExternalLink(link)

  return (
    user ?
      (
        isOut ?
          <Link href={link} color={color} target='_blank'>{user.name}{children}</Link> :
          <Link to={user.link} color={color} component={RouterLink}>{user.name}{children}</Link>
      ) :
      <Typography color={color}>
        Гость{children}
      </Typography>
  )
}
