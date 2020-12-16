import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { RouteLink } from '../../route/RouteLink'
import { ListItem, ListItemText } from '@material-ui/core'
import { FromNowDate } from '../../ui-kit/from-now-date/FromNowDate'
import { UserLink } from '../../user/UserLink'
import { IBoardEx } from '../../../../common/forum/forum.ex.interfaces'
import { useStyles } from './styles'
import { toJS } from 'mobx'


interface Props {
  board: IBoardEx
  level?: boolean
}

export const BoardItem: FC<Props> = observer(function BoardItem (props) {
  const board = props.board
  console.log(toJS(board))
  const classes = useStyles({
    level: props.level ? board.level : 0
  })

  // const relations = store.forumStore.getRelationsForItem('board', board)
  // console.log('relations', relations)

  // const lastTopic = relations[BoardRelations.lastTopic]
  // const lastMessage = relations[BoardRelations.lastMessage]
  // const lastUser = relations[BoardRelations.lastUser] ?? (lastMessage ? store.forumStore.userStore.get(lastMessage.linksId.user) : undefined)
  const lastTopic = board.last.topic
  const lastMessage = board.last.message
  const lastUser = board.last.user

  return (
    <ListItem>
      <ListItemText
        primary={<RouteLink to={'boardTopicList'} route={{ board }}>{board.name}</RouteLink>}
        secondary={
          <div className={classes.body}>
            <div>{board.description}</div>
            {lastTopic &&
            <RouteLink to={'topicMessageList'} route={{ topic: lastTopic }}>{lastTopic.subject}</RouteLink>}
            {lastUser && <UserLink user={lastUser}/>}
            {lastMessage && <FromNowDate date={lastMessage.date}/>}
            {/*{lastTopic && <RouteLink to={'topicMessageList'} route={{topic: lastTopic}}>{lastTopic.subject}</RouteLink>}*/}
            {/*{lastUser && <UserLink user={lastUser}/>}*/}
            {/*{lastMessage && <FromNowDate date={lastMessage.dates.createdAt}/>}*/}
          </div>
        }
        secondaryTypographyProps={{ component: 'div' }}
      />
    </ListItem>
  )
})
