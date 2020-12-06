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


interface Props {
  page?: number
}

export const LastMessagesPage: FC<Props> = observer(function LastMessagesPage (props: Props) {
// debugger
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

  const relationData = forumStore.getRelations('message', pageData?.items)
  /// ----

  const pagination =
    <RoutePagination
      count={pageData?.meta.totalPages ?? (props?.page ?? -1) + 2}
      page={uiStore.loading ? props.page : (pageData?.meta.currentPage ?? props?.page ?? 1)}
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
