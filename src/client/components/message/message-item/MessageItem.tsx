import { FC, ReactNode, useMemo } from 'react'
import { IMessage } from '../../../../common/forum/forum.interfaces'
import { ListItem, ListItemAvatar, ListItemText, Typography, Breadcrumbs } from '@material-ui/core'
import { User } from '../../../../common/forum/models/user'
import { UserLink } from '../../user/UserLink'
import { UserAvatar } from '../../user/UserAvatar'
import { MessageRelationsSingle } from '../../../../common/forum/forum.entity-relations'
import { parseBBCodes } from '../../../Tags/parse'
import { FromNowDate } from '../../ui-kit/from-now-date/FromNowDate'
import { RouteLink } from '../../route/RouteLink'
import { useStyles } from './styles'
import { observer } from 'mobx-react-lite'
import { store } from '../../../store'


export interface MessageItemProps {
  message: IMessage
  user?: User
  // relations?: MessageRelationsSingle
  breadcrumb?: boolean
}

type Props = MessageItemProps


export const MessageItem: FC<Props> = observer((props) => {
  const {
    message,
    breadcrumb = false,
  } = props

  const relations = /*props.relations ?? */store.forumStore.getRelationsForItem('message', message)

  const {
    board,
    topic,
    category,
    user
  } = relations

  const classes = useStyles()

  const breadcrumbsNodes: ReactNode[] = []

  if (breadcrumb) {
    if (category?.name) {
      breadcrumbsNodes.push(category?.name)
    }
    if (board?.name) {
      breadcrumbsNodes.push(<RouteLink key={board.id} to={'boardTopicList'} route={{ board }}>{board.name}</RouteLink>)
    }
    if (topic?.subject) {
      breadcrumbsNodes.push(<RouteLink key={topic.id} to={'topicMessageList'}
                                       route={{ topic }}>{topic.subject}</RouteLink>)
    }
  }

  const body = useMemo(
    () => parseBBCodes(message.body),
    [message.body],
  )

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
            {breadcrumbsNodes.length ?
              <Breadcrumbs>
                {breadcrumbsNodes}
              </Breadcrumbs> : ''
            }
          </div>
        }
        secondary={
          body
        }
        secondaryTypographyProps={{ component: 'div', className: classes.body }}
      />
    </ListItem>
  )
})

