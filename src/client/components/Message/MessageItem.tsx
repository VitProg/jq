import React, { FC, ReactNode } from 'react'
import { IMessage } from '../../../common/forum/forum.interfaces'
import { createStyles, ListItem, ListItemAvatar, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core'
import { User } from '../../../common/forum/models/user'
import { UserLink } from '../User/UserLink'
import { UserAvatar } from '../User/UserAvatar'
import { MessageRelationsSingle } from '../../../common/forum/forum.entity-relations'
import { createUserModel } from '../../../common/forum/fabrics/create-user.fabric'
import { parseBBCodes } from '../../Tags/parse'
import { fromNowDate } from '../../utils/date'
import { FromNowDate } from '../common/FromNowDate'
import { RouteLink } from '../Route/RouteLink'

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

  const subjects: ReactNode[] = []

  const { message } = props
  const { board, topic, category } = props.relations ?? { board: undefined, topic: undefined, category: undefined, }
  const user = createUserModel(props.relations?.user)

  if (category?.name) {
    subjects.push(category?.name)
  }
  if (board?.name) {
    subjects.push(<RouteLink key={board.id} to={'boardTopicList'} route={{ board }}>{ board.name }</RouteLink>)
  }
  if (topic?.subject) {
    subjects.push(<RouteLink key={topic.id} to={'topicMessageList'} route={{ topic }}>{ topic.subject }</RouteLink>)
  }

  const body = parseBBCodes(message.body)

  const date = message.dates.createdAt

  return (
    <ListItem alignItems={'flex-start'}>
      <ListItemAvatar>
        <UserAvatar user={user} withLink={true}/>
      </ListItemAvatar>
      <ListItemText
        primary={
          <div>
            <UserLink user={user}/>
            {date && <Typography component='div' variant='body2'><FromNowDate date={date}/></Typography>}
            {subjects.length ?
            <Typography component='div'>
              {subjects.map((s, index) => <>{s}{index < subjects.length - 1 ? ' / ' : ''}</>)}
            </Typography> : ''
            }
          </div>
        }
        secondary={
          body
        }
        secondaryTypographyProps={{ component: 'div', className: classes.messageBody }}
      />
    </ListItem>
  )
}
