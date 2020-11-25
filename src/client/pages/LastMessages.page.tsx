import React, { FC, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces'
import { Pagination, PaginationItem } from '@material-ui/lab'
import { useInjection } from '../ioc/ioc.react'
import { ApiServiceSymbol } from '../ioc/ioc.symbols'
import { IApiService } from '../services/interfaces'
import { IBoard, IMessage, ITopic, IUser } from '../../common/forum/forum.interfaces'
import { useStateRecord } from '../hooks/use-state-record'
import { useStore } from '../hooks/use-store'
import { MessageList } from '../components/MessageList'
import { observer } from 'mobx-react-lite'
import { MessageRelationsRecord } from '../../common/forum/forum.entity-relations'


export const LastMessagesPage: FC = observer(function LastMessagesPage (props) {
  const apiService = useInjection<IApiService>(ApiServiceSymbol)
  const { ui } = useStore()

  const [data, setData] = useState<{
    messages: IMessage[]
    relations: MessageRelationsRecord,
    meta: IPaginationMeta
  }>()

  // const [messages, setMessages] = useState<IMessage[]>([])
  // const [users, , updateUsers] = useStateRecord<number, IUser>({})
  // const [topics, , updateTopics] = useStateRecord<number, ITopic>({})
  // const [boards, , updateBoards] = useStateRecord<number, IBoard>({})
  // const [meta, setMeta] = useState<IPaginationMeta | undefined>()

  const { page: routePage } = useParams<{ page?: string }>()
  const [page, setPage] = useState(parseInt(routePage ?? '1', 10))

  useEffect(() => {
    setPage(parseInt(routePage ?? '1', 10))
  }, [routePage])

  useEffect(() => {
    ui.setLoading(true)

    const promise = apiService.loadLastMessages({
      page,
      pageSize: 5,
      relations: ['board', 'user', 'topic'],
    })

    promise
      .finally(() => {
        ui.setLoading(false)
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
        console.log('MP cancel()')
        promise.cancel()
      }
    }
  }, [page])

  const pagination = data?.meta ?
    <Pagination
      count={data.meta.totalPages}
      page={data.meta.currentPage >> 0}
      renderItem={(item) => <PaginationItem {...item} component={Link} to={`/messages/${item.page}`}/>}
    /> : null

  return (
    <>
      {pagination}
      {data && <MessageList messages={data.messages} relations={data.relations}/>}
      {pagination}
    </>
  )
})
