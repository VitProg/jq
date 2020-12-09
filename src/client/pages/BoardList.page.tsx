import React, { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../hooks/use-store'
import { Container, List, ListItem, ListItemText } from '@material-ui/core'
import { RouteLink } from '../components/Route/RouteLink'
import { pick } from '../../common/utils/object'


interface Props {
}

export const BoardListPage: FC<Props> = observer(function BoardListPage (props: Props) {
  const { uiStore, forumStore } = useStore()

  const boards = forumStore.boardStore.getAll(false)

  return (
    <Container>
      <List>
        {boards.map(board => (
          <ListItem key={board.id}>
            <ListItemText
              primary={<RouteLink to={'boardTopicList'} route={{board}}>{board.name}</RouteLink>}
              secondary={board.description}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  )
})
