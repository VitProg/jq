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
import { MessagesServiceSymbol } from '../services/ioc.symbols'
import { IMessagesService } from '../services/forum/types'


interface Props {
  page?: number
}

export const LastMessagesPage: FC<Props> = observer(function LastMessagesPage (props: Props) {
  const messagesService = useInjection<IMessagesService>(MessagesServiceSymbol)
  const { uiStore } = useStore()

  const [data, setData] = useState<{
    messages: IMessage[]
    relations: MessageRelationsRecord,
    meta: IPaginationMeta
  }>()

  const routePage = props.page ?? 1
  const [page, setPage] = useState(routePage)

  useEffect(() => {
    setPage(routePage)
  }, [routePage])

  useEffect(() => {
    uiStore.setLoading(true)

    const promise = messagesService.latest({
      page,
      pageSize: 5,
      relations: ['board', 'user', 'topic'],
    })

    promise
      .finally(() => {
        uiStore.setLoading(false)
      })
      .then(response => {
        if (response) {
          setData({
            messages: response.items,
            meta: response.meta,
            relations: {
              user: response.relations?.user,
              topic: response.relations?.topic,
              board: response.relations?.board,
            }
          })
        } else {
          setData(undefined)
        }
      })
      .catch(err => {
        console.warn(err)
      })

    return () => {
      if (promise && !promise.isCanceled()) {
        promise.cancel()
      }
    }
  }, [page])

  const pagination =
    <RoutePagination
      count={data?.meta.totalPages ?? props?.page ?? 1}
      page={uiStore.loading ? props.page : (data?.meta.currentPage ?? props?.page ?? 1)}
      route={p => routes.lastMessages({ page: p.page })}
    />

  return (
    <Container>
      {pagination}
      <MessageList
        messages={uiStore.loading ? undefined : data?.messages}
        relations={data?.relations}
      />
      {pagination}
    </Container>
  )
})
