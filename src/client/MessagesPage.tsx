import React, { FC, useEffect, useState } from 'react'
import * as Styled from './styled'
import { Link, useParams } from 'react-router-dom'
import { LastMessageResponse } from '../common/forum/forum.responses'
import { Board, Message, Topic, User } from '../common/forum/forum.entities'
import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces'
import { MessageItem } from './MessageItem'


export const MessagesPage: FC<{}> = (props) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setRelatedUsers] = useState<Record<number, User>>({})
  const [topics, setRelatedTopics] = useState<Record<number, Topic>>({})
  const [boards, setRelatedBoards] = useState<Record<number, Board>>({})

  const [loading, setLoading] = useState(false)

  const [meta, setMeta] = useState<IPaginationMeta | undefined>()
  const { page: routePage } = useParams<{ page?: string }>()

  const [page, setPage] = useState(parseInt(routePage ?? '1', 10))
  useEffect(() => {
    setPage(parseInt(routePage ?? '1', 10))
  }, [routePage])

  useEffect(() => {
    let abortController = new AbortController();

    setLoading(true)

    fetch(
      `/api/last-messages?relations=board,user&pageSize=5&page=${page}`,
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

  return (
    <>
      {messages.map(message => (
          <MessageItem
            key={message.id}
            message={message}
            relatedBoard={boards?.[message.linksId.board]}
            relatedUser={users?.[message.linksId.user]}
            loading={loading}
          />
        )
      )}
      {meta && page > 1 && <Link to={`/messages/${page - 1}`}>{'<= Prev'}</Link>}
      {meta && page <= meta.totalPages && <Link to={`/messages/${page + 1}`}>{'Next =>'}</Link>}
    </>
  )
}
