import { FC } from 'react'
import { makeStyles, Theme, Typography, TypographyTypeMap } from '@material-ui/core'
import { RouteLink } from '../route/RouteLink'
import { getUserName } from '../../../common/forum/utils'
import { IUser } from '../../../common/forum/forum.interfaces'
import { isString } from '../../../common/type-guards'


interface Props {
  user?: IUser | string
  color?: TypographyTypeMap['props']['color'] | string
}


export const useStyles = makeStyles((theme: Theme) => (
  {
    link: {
      color: (props: Props) => props.color,
      textDecoration: 'none',
      fontWeight: 500,
    },
  }
))

export const UserLink: FC<Props> = (props) => {
  const {
    user,
    children,
    color = '#B57F00',
  } = props

  const classes = useStyles({color})

  return (
    user ?
      (isString(user) ?
        (
          <span className={classes.link}>{children ? children : user}</span>
        ):
        (
          <RouteLink className={classes.link} to={'user'} route={{ user }}>{children ? children : getUserName(user)}</RouteLink>
        )
      ) :
      <Typography className={classes.link}>{children ? children : 'Гость'}</Typography>
  )
}
