import React, { FC, useEffect, useState } from 'react'
import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces'
import { useInjection } from '../ioc/ioc.react'
import { IMessage } from '../../common/forum/forum.interfaces'
import { useStore } from '../hooks/use-store'
import { MessageList } from '../components/Message/MessageList'
import { observer } from 'mobx-react-lite'
import { MessageRelationsRecord } from '../../common/forum/forum.entity-relations'
import { RoutePagination } from '../components/Route/RoutePagination'
import { Container } from '@material-ui/core'
import { routes } from '../routing'
import { ForumServiceSymbol, MessageServiceSymbol } from '../services/ioc.symbols'
import { IForumService, IMessageService } from '../services/forum/types'
import { store } from '../store'
import { mute } from '../../common/utils/promise'
import { usePage } from '../hooks/use-page'
import { toJS } from 'mobx'


interface Props {
  page?: number
}

export const LastMessagesPage: FC<Props> = observer(function LastMessagesPage (props: Props) {
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
  const totalPages = pageData?.meta.totalPages ?? pageMeta?.totalPages ?? (props?.page ?? 0) + 1
  const currentPage = uiStore.loading ? props.page : (pageData?.meta.currentPage ?? props?.page ?? 1)
  /// ----

  console.log('pageData', toJS(pageData))
  console.log('pageMeta', toJS(pageMeta))
  console.log('relationData', toJS(relationData))

  const pagination =
    <RoutePagination
      count={totalPages}
      page={currentPage}
      route={p => routes.lastMessages({ page: p.page })}
    />

  return (
    <Container>
      {pagination}
      <MessageList
        messages={uiStore.loading ? undefined : pageData?.items}
        relations={relationData}
      />
      {pagination}
    </Container>
  )
})
