import React, { FC } from 'react'
import { useStore } from '../hooks/use-store'
import { MessageList } from '../components/Message/MessageList'
import { observer } from 'mobx-react-lite'
import { Container, Typography } from '@material-ui/core'
import { routes } from '../routing'
import { store } from '../store'
import { usePage } from '../hooks/use-page'
import { uesRoutePagination } from '../hooks/use-route-pagination'
import { MessageRelations } from '../../common/forum/forum.entity-relations'


interface Props {
  topic: { id: number, url: string }
  page?: number
}

export const TopicMessageListPage: FC<Props> = observer(function TopicMessageListPage (props: Props) {
  const { uiStore, forumStore } = useStore()

  const [page] = usePage(props)

  const topic = forumStore.topicStore.get(props.topic.id)

  store.seoStore.setTitle(topic ? topic.subject : '')
  if (page > 1) {
    store.seoStore.addTitle(`Страница: ${page}`)
  }

  const pageData = forumStore.messageStore.getPage({
    page,
    type: 'topic',
    topic: props.topic.id
  })

  const pageMeta = forumStore.messageStore.getPageMeta({
    type: 'topic',
    topic: props.topic.id
  })

  const relationData = forumStore.getRelations(
    'message',
    pageData?.items,
    [MessageRelations.user],
  )

  console.log('pageData', pageData)
  console.log('pageMeta', pageMeta)
  console.log('relationData', relationData)

  const pagination = uesRoutePagination(
    p => routes.topicMessageList({ topic: props.topic, page: p.page }),
    page,
    pageData?.meta,
    pageMeta,
    uiStore.loading
  )

  return (
    <Container>
      {topic && <>
        <Typography variant="h6" component="h1">{topic.subject}</Typography>
      </>}

      {pagination.component}
      <MessageList
        messages={uiStore.loading ? undefined : pageData?.items}
      />
      {pagination.component}
    </Container>
  )
})
