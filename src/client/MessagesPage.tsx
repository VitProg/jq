import React, { FC, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LastMessageResponse } from '../common/forum/forum.responses'
import { IBoard, IMessage, ITopic, IUser } from '../common/forum/forum.interfaces'
import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces'
import { MessageItem } from './MessageItem'
import { Pagination, PaginationItem } from '@material-ui/lab'
import { User } from '../common/forum/entities/user'


export const MessagesPage: FC = (props) => {
  const [messages, setMessages] = useState<IMessage[]>([])
  const [users, setRelatedUsers] = useState<Record<number, IUser>>({})
  const [topics, setRelatedTopics] = useState<Record<number, ITopic>>({})
  const [boards, setRelatedBoards] = useState<Record<number, IBoard>>({})

  const [loading, setLoading] = useState(false)

  const [meta, setMeta] = useState<IPaginationMeta | undefined>()
  const { page: routePage } = useParams<{ page?: string }>()

  const [page, setPage] = useState(parseInt(routePage ?? '1', 10))
  useEffect(() => {
    setPage(parseInt(routePage ?? '1', 10))
  }, [routePage])

  useEffect(() => {
    const abortController = new AbortController()

    setLoading(true)

    fetch(
      `/api/last-messages?relations=board,user,topic&pageSize=5&page=${page}`,
      {
        signal: abortController.signal,
      }
    )
      .then<LastMessageResponse>(data => data.json())
      .then(data => {
        setMessages(data.items)
        setMeta(data.meta)

        if (data.relations?.user) {
          setRelatedUsers({
            ...users,
            ...data.relations.user
          })
        }

        if (data.relations?.topic) {
          setRelatedTopics({
            ...topics,
            ...data.relations.topic
          })
        }

        if (data.relations?.board) {
          setRelatedBoards({
            ...boards,
            ...data.relations.board
          })
        }
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('ABORT')
        } else {
          throw err
        }
      })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      if (abortController) {
        abortController.abort()
      }
    }
  }, [page])

  const pagination = meta ?
    <Pagination
      count={meta.totalPages}
      page={meta.currentPage >> 0}
      onChange={event => console.log(event)}
      renderItem={(item) => <PaginationItem {...item} component={Link} to={`/messages/${item.page}`}/>}
    /> : null
//todo
  return (
    <>
      {pagination}
      {messages.map(message => (
          <MessageItem
            key={message.id}
            message={message}
            topic={topics?.[message.linksId.topic]}
            board={boards?.[message.linksId.board]}
            user={User.create(users?.[message.linksId.user])}
            loading={loading}
          />
        )
      )}
      {/*{meta && page > 1 && <Link to={`/messages/${page - 1}`}>{'<= Prev'}</Link>}*/}
      {/*{meta && page <= meta.totalPages && <Link to={`/messages/${page + 1}`}>{'Next =>'}</Link>}*/}
      {pagination}
    </>
  )
}
