import { FC, MouseEvent } from 'react'
import { Avatar, createStyles, makeStyles, Theme } from '@material-ui/core'
import { RouteLink } from '../route/RouteLink'
import { observer } from 'mobx-react-lite'
import { store } from '../../store'
import { IUser } from '../../../common/forum/forum.interfaces'
import { getUserName } from '../../../common/forum/utils'

type Sizes = 'small' | 'normal' | 'large' | 'full'
type SizeProps = {
  width: number
  height?: number
}

interface Props {
  user?: IUser
  withLink?: boolean
  onCLick?: (event: MouseEvent<HTMLElement>) => void
  size?: Sizes
  backgroundColor?: string
  variant?: 'circular' | 'rounded' | 'square'
}

const sizes: Record<Sizes, SizeProps> = {
  small: { width: 4 },
  normal: { width: 6 },
  large: { width: 8 },
  full: { width: 8, height: 10 },
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: (props: Props) => {
      const prop = sizes[props.size ?? 'normal']
      return ({
        width: theme.spacing(prop.width),
        height: theme.spacing(prop.height ?? prop.width),
        ...(props.backgroundColor ? {backgroundColor: props.backgroundColor} : {})
      })
    },
  }),
);

export const UserAvatar: FC<Props> = observer(function UserAvatar (props) {
  const {
    user,
    withLink = false,
    onCLick,
    variant = 'circular'
  } = props

  const classes = useStyles(props)

  if (user) {
    const avatar = store.configStore.getUserAvatarUrl(user)
    const userName = getUserName(user)
    const latter = userName.substr(0, 1)

    if (withLink) {
      return (
        <Avatar
          onClick={onCLick}
          alt={userName}
          src={avatar}
          component={RouteLink as any}
          to={'user'}
          route={{ user }}
          className={classes.avatar}
          variant={variant}
        >{latter}</Avatar>
      )
    }

    return (
      <Avatar
        onClick={onCLick}
        alt={userName}
        src={avatar}
        className={classes.avatar}
        variant={variant}
      />
    )
  }

  return (
    <Avatar
      onClick={onCLick}
      alt='?'
      className={classes.avatar}
      variant={variant}
    >?</Avatar>
  )
})
