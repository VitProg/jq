import { FC, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Container, List, ListItem, ListItemText, Typography } from '@material-ui/core'
import { RouteLink } from '../components/route/RouteLink'
import { routes } from '../routing'
import { uesRoutePagination } from '../hooks/use-route-pagination'
import { ITopic } from '../../common/forum/forum.base.interfaces'
import { usePage } from '../hooks/use-page'
import { store } from '../store'
import { usePageMetadata } from '../hooks/use-page-metadata'
import { ITopicEx } from '../../common/forum/forum.ex.interfaces'
import { specifyCurrentRoute } from '../routing/utils'


interface Props {
  board: { id: number, url: string }
  page?: number
}

export const BoardTopicList: FC<Props> = observer(function BoardTopicList (props: Props) {
  const [page] = usePage(props.page)

  const board = store.forumStore.boardStore.get(props.board.id)

  specifyCurrentRoute(!!board, 'boardTopicList', { board, page })

  // ToDo: automate this
  const canonicRoute = board ? routes.boardTopicList({ board, page }) : undefined
  if (canonicRoute && store.routeStore.noModalRoute?.href !== canonicRoute.href) {
    canonicRoute.replace()
  }

  const pageData = store.forumStore.topicStore.getPage({
    page,
    type: 'board',
    board: props.board.id,
  })

  const pageMeta = store.forumStore.topicStore.getPageMeta({
    type: 'board',
    board: props.board.id,
  })

  const pagination = uesRoutePagination(
    p => routes.boardTopicList({ board: props.board, page: p.page }),
    page,
    pageData?.meta,
    pageMeta,
    store.uiStore.loading
  )

  usePageMetadata({
    title: board?.name,
    pagination,
  })

  const has = !!pageData?.items?.length

  return (
    <Container>
      {board && <>
        {/*<Typography variant="h5" component="h1">{board.name}</Typography>*/}
        {board.description && <Typography variant="subtitle1" component="div">{board.description}</Typography>}
      </>}

      {has && (
        <>
          {pagination.component}
          <List>
            {pageData!.items.map((topic: ITopicEx) => (
              <ListItem key={topic.id}>
                <ListItemText
                  primary={<RouteLink to={'topicMessageList'} route={{ topic }}>{topic.subject}</RouteLink>}
                  secondary={topic.counters?.message ? `messages: ${topic.counters?.message}` : ''}
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
