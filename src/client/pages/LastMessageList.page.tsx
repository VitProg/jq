import React, { FC } from 'react'
import { useStore } from '../hooks/use-store'
import { MessageList } from '../components/Message/MessageList'
import { observer } from 'mobx-react-lite'
import { Container } from '@material-ui/core'
import { routes } from '../routing'
import { store } from '../store'
import { usePage } from '../hooks/use-page'
import { uesRoutePagination } from '../hooks/use-route-pagination'


interface Props {
  page?: number
}

export const LastMessageListPage: FC<Props> = observer(function LastMessageListPage (props: Props) {
  const { uiStore, forumStore } = useStore()

  const [page] = usePage(props)

  store.seoStore.setTitle('Последние сообщения')
  if (page > 1) {
    store.seoStore.addTitle(`Страница: ${page}`)
  }

  /// todo
  const pageData = forumStore.messageStore.getPage({
    page,
    type: 'latest',
  })

  const pageMeta = forumStore.messageStore.getPageMeta({
    type: 'latest',
  })

  const relationData = forumStore.getRelations('message', pageData?.items)
  /// ----

  const pagination = uesRoutePagination(
    p => routes.lastMessages({ page: p.page }),
    page,
    pageData?.meta,
    pageMeta,
    uiStore.loading
  )

  return (
    <Container>
      {pagination.component}
      <MessageList
        messages={uiStore.loading ? undefined : pageData?.items}
        relations={relationData}
      />
      {pagination.component}
    </Container>
  )
})
