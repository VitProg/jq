import React, { FC } from 'react'
import { IMessage } from '../../../common/forum/forum.interfaces'
import { createStyles, ListItem, ListItemAvatar, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core'
import { User } from '../../../common/forum/models/user'
import { UserLink } from '../User/UserLink'
import parser from 'bbcode-to-react'
import { UserAvatar } from '../User/UserAvatar'
import { MessageRelationsSingle } from '../../../common/forum/forum.entity-relations'
import { createUserModel } from '../../../common/forum/fabrics/create-user.fabric'


interface ExternalProps {
  message: IMessage
  user?: User
  relations?: MessageRelationsSingle
}

type Props = ExternalProps

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    messageBody: {
      whiteSpace: 'pre-line',
      wordBreak: 'break-word',

      '& img, & iframe, & object, & table': {
        maxWidth: '100%',
      }
    }
  })
)

export const MessageItem: FC<Props> = (props) => {

  const classes = useStyles()

  const subjects: any[] = []

  const { message } = props
  const { board, topic, category } = props.relations ?? { board: undefined, topic: undefined, category: undefined, }
  const user = createUserModel(props.relations?.user)

  if (category?.name) {
    subjects.push(category?.name)
  }
  if (board?.name) {
    subjects.push(board?.name)
  }
  if (topic?.subject) {
    subjects.push(topic?.subject)
  }

  const html = parser.toReact(message.body
    .replace(/<br\s*\/?>/gm, '\n')
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
          html
        }
        secondaryTypographyProps={{ component: 'div', className: classes.messageBody }}
      />
    </ListItem>
  )
}
