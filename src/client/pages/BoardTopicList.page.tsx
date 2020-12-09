import React, { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../hooks/use-store'
import { Container, List, ListItem, ListItemText, Typography } from '@material-ui/core'
import { RouteLink } from '../components/Route/RouteLink'
import { routes } from '../routing'
import { uesRoutePagination } from '../hooks/use-route-pagination'
import { ITopic } from '../../common/forum/forum.interfaces'
import { usePage } from '../hooks/use-page'
import { store } from '../store'


interface Props {
  board: { id: number, url: string }
  page?: number
}

export const BoardTopicList: FC<Props> = observer(function BoardTopicList (props: Props) {
  const { uiStore, forumStore } = useStore()

  const [page] = usePage(props)

  const board = forumStore.boardStore.get(props.board.id)

  store.seoStore.setTitle(board ? board.name : '')
  if (page > 1) {
    store.seoStore.addTitle(`Страница: ${page}`)
  }

  const pageData = forumStore.topicStore.getPage({
    page,
    type: 'board',
    board: props.board.id,
  })

  const pageMeta = forumStore.topicStore.getPageMeta({
    type: 'board',
    board: props.board.id,
  })

  const relationData = forumStore.getRelations('topic', pageData?.items)

  console.log('relationData', relationData)

  const pagination = uesRoutePagination(
    p => routes.boardTopicList({ board: props.board, page: p.page }),
    page,
    pageData?.meta,
    pageMeta,
    uiStore.loading
  )

  const has = !!pageData?.items?.length

  return (
    <Container>
      {board && <>
        <Typography variant="h5" component="h1">{board.name}</Typography>
        {board.description && <Typography variant="subtitle1" component="div">{board.description}</Typography>}
      </>}

      {has && (
        <>
          {pagination.component}
          <List>
            {pageData!.items.map((topic: ITopic) => (
              <ListItem key={topic.id}>
                <ListItemText
                  primary={<RouteLink to={'topicMessageList'} route={{ topic }}>{topic.subject}</RouteLink>}
                  secondary={topic.counters?.messages ? `messages: ${topic.counters?.messages}` : ''}
                />
              </ListItem>
            ))}
          </List>
          {pagination.component}
        </>
      )}
    </Container>
  )
})
