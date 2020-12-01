import React, { FC, useEffect, useState } from 'react'
import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces'
import { Pagination, PaginationItem } from '@material-ui/lab'
import { useInjection } from '../ioc/ioc.react'
import { ApiServiceSymbol } from '../ioc/ioc.symbols'
import { IApiService } from '../services/interfaces'
import { IMessage } from '../../common/forum/forum.interfaces'
import { useStore } from '../hooks/use-store'
import { MessageList } from '../components/Message/MessageList'
import { observer } from 'mobx-react-lite'
import { MessageRelationsRecord } from '../../common/forum/forum.entity-relations'
import { RouteLink } from '../components/Route/RouteLink'
import { routes } from '../routes'
import { RoutePagination } from '../components/Route/RoutePagination'


interface Props {
  page?: number
}

export const LastMessagesPage: FC<Props> = observer(function LastMessagesPage (props) {
  const apiService = useInjection<IApiService>(ApiServiceSymbol)
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

    const promise = apiService.loadLastMessages({
      page,
      pageSize: 5,
      relations: ['board', 'user', 'topic'],
    })

    promise
      .finally(() => {
        uiStore.setLoading(false)
      })
      .then(response => {
        setData({
          messages: response.items,
          meta: response.meta,
          relations: {
            user: response.relations?.user,
            topic: response.relations?.topic,
            board: response.relations?.board,
          }
        })
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

  const pagination = data?.meta
    ? <RoutePagination
      count={data.meta.totalPages}
      page={data.meta.currentPage >> 0}
      route={p => routes.lastMessages({page: p.page})}
    />
    : null

  return (
    <>
      {pagination}
      {data && <MessageList messages={data.messages} relations={data.relations}/>}
      {pagination}
    </>
  )
})
