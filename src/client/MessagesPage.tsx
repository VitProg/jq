import React, { FC, useEffect, useState } from 'react'
import * as Styled from './styled'
import { Link, useParams } from 'react-router-dom'
import { LastMessageResponse } from '../common/forums.responses'
import { Board, Message, Topic, User } from '../common/forum.entities'
import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces'


export const MessagesPage: FC<{}> = (props) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setRelatedUsers] = useState<Record<number, User>>({})
  const [topics, setRelatedTopics] = useState<Record<number, Topic>>({})
  const [boards, setRelatedBoards] = useState<Record<number, Board>>({})

  const [meta, setMeta] = useState<IPaginationMeta | undefined>()
  const { page: routePage } = useParams<{ page?: string }>()

  const [page, setPage] = useState(parseInt(routePage ?? '1', 10))
  useEffect(() => {
    setPage(parseInt(routePage ?? '1', 10))
  }, [routePage])
debugger

  useEffect(() => {
    fetch(`/api/last-messages?relations=board,user&pageSize=10&page=${page}`)
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
  }, [page, routePage])

  return (
    <>
      {messages.map(message => (
        <Styled.Message key={message.id}>
          <h4>Date: {message.createdAt}</h4>
          <h6>Author: {users[message.linksId.user]?.displayName ?? users[message.linksId.user]?.login}</h6>
          <div>{message.body}</div>
        </Styled.Message>
      ))}
      {meta && page > 1 && <Link to={`/messages/${page - 1}`}>{'<= Prev'}</Link>}
      {meta && page <= meta.totalPages && <Link to={`/messages/${page + 1}`}>{'Next =>'}</Link>}
    </>
  )
}
