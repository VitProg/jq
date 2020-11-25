import React, { FC } from 'react'
import { IBoard, IMessage, ITopic } from '../common/forum/forum.interfaces'
import { Avatar, createStyles, Link, ListItem, ListItemAvatar, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core'
import { User } from '../common/forum/entities/user'
import {Link as RouterLink} from 'react-router-dom'
import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import { ForumConfiguration } from '../common/forum/forum.constants'
import { UserLink } from './User/UserLink'
import parser from 'bbcode-to-react'
import { UserAvatar } from './User/UserAvatar'


interface ExternalProps {
  message: IMessage
  user?: User
  topic?: ITopic
  board?: IBoard
  loading?: boolean
}

type Props = ExternalProps

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    messageBody: {
      whiteSpace: 'pre-line'
    }
  })
)

export const MessageItem: FC<Props> = (props) => {

  const classes = useStyles()

  const {
    message,
    board,
    topic,
    user,
    loading = false,
  } = props

  const subjects: any[] = []

  if (board?.category?.name) {
    subjects.push(board?.category?.name)
  }
  if (board?.name) {
    subjects.push(board?.name)
  }
  if (topic?.subject) {
    subjects.push(topic?.subject)
  }

  const html = parser.toReact(message.body
    .replace(/<br\s*\/?>/gm, "\n")
    .split('&nbsp;').join(' ')
    .split('&quot;').join('"')
  )


  return (
    <ListItem alignItems={'flex-start'}>
      <ListItemAvatar>
        <UserAvatar user={user} withLink={true}/>
      </ListItemAvatar>
      <ListItemText
        primary={
          <div>
            <UserLink user={user}/>
            {subjects.length &&
              <Typography component='div'>
                {subjects.join(' / ')}
              </Typography>
            }
          </div>
        }
        secondary={
          // <div dangerouslySetInnerHTML={{__html: html}}/>
          html
        }
        secondaryTypographyProps={{component: 'div', className: classes.messageBody}}
      />
    </ListItem>
  )
}
