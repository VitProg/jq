import { User } from '../../../common/forum/entities/user'
import React, { FC } from 'react'
import { Typography, TypographyTypeMap } from '@material-ui/core'
import { RouteLink } from '../Route/RouteLink'


export const UserLink: FC<{ user?: User, color?: TypographyTypeMap['props']['color'] }> = (
  {
    user,
    color = 'primary',
    children,
  }
) => {
  return (
    user ?
      (
        <RouteLink to={'user'} route={{ user }}>{children ? children : user.name}</RouteLink>
      ) :
      <Typography color={color}>{children ? children : 'Гость'}</Typography>
  )
}
