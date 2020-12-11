import { FC } from 'react'
import { MessageList } from '../components/message/message-list/MessageList'
import { observer } from 'mobx-react-lite'
import { Container } from '@material-ui/core'
import { routes } from '../routing'
import { store } from '../store'
import { usePage } from '../hooks/use-page'
import { uesRoutePagination } from '../hooks/use-route-pagination'
import { usePageMetadata } from '../hooks/use-page-metadata'
import { IBoard, ITopic } from '../../common/forum/forum.interfaces'


interface Props {
  topic: { id: number, url: string }
  page?: number
}

export const TopicMessageListPage: FC<Props> = observer(function TopicMessageListPage (props: Props) {
  const [page] = usePage(props.page)

  const topic: ITopic | undefined = store.forumStore.topicStore.get(props.topic.id)
  const board: IBoard | undefined = topic && store.forumStore.boardStore.get(topic.linksId.board)

  const pageData = store.forumStore.messageStore.getPage({
    page,
    type: 'topic',
    topic: props.topic.id
  })

  const pageMeta = store.forumStore.messageStore.getPageMeta({
    type: 'topic',
    topic: props.topic.id
  })

  const pagination = uesRoutePagination(
    p => routes.topicMessageList({ topic: props.topic, page: p.page }),
    page,
    pageData?.meta,
    pageMeta,
    store.uiStore.loading
  )

  usePageMetadata({
    title: topic?.subject,
    pagination,
    routes: [
      !!board && [board.name, routes.boardTopicList({ board: board })],
      !!topic && [topic.subject, routes.topicMessageList({ topic: topic })],
    ],
  })

  return (
    <Container>
      {pagination.component}
      <MessageList
        messages={store.uiStore.loading ? undefined : pageData?.items}
      />
      {pagination.component}
    </Container>
  )
})
