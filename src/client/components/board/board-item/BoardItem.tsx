import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { IBoard } from '../../../../common/forum/forum.interfaces'
import { RouteLink } from '../../route/RouteLink'
import { ListItem, ListItemText } from '@material-ui/core'
import { store } from '../../../store'
import { BoardRelations } from '../../../../common/forum/forum.entity-relations'
import { FromNowDate } from '../../ui-kit/from-now-date/FromNowDate'
import { UserLink } from '../../user/UserLink'


interface Props {
  board: IBoard
}

export const BoardItem: FC<Props> = observer(function BoardItem (props) {
  const {
    board
  } = props

  const relations = store.forumStore.getRelationsForItem('board', board)
  console.log('relations', relations)

  const lastTopic = relations[BoardRelations.lastTopic]
  const lastMessage = relations[BoardRelations.lastMessage]
  const lastUser = relations[BoardRelations.lastUser] ?? (lastMessage ? store.forumStore.userStore.get(lastMessage.linksId.user) : undefined)

  return (
    <ListItem>
      <ListItemText
        primary={<RouteLink to={'boardTopicList'} route={{ board }}>{board.name}</RouteLink>}
        secondary={
          <>
            <div>{board.description}</div>
            {lastTopic && <RouteLink to={'topicMessageList'} route={{topic: lastTopic}}>{lastTopic.subject}</RouteLink>}
            {lastUser && <UserLink user={lastUser}/>}
            {lastMessage && <FromNowDate date={lastMessage.dates.createdAt}/>}
          </>
        }
      />
    </ListItem>
  )
})
