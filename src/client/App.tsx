import React, { useEffect, useState } from 'react'
import {render} from 'react-dom'
import { Board, Message, Topic, User } from '../common/forum.entities'
import { LastMessageResponse } from '../common/forums.responses'
import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces'
import * as Styled from './styled'


const App = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setRelatedUsers] = useState<Record<number, User>>({})
  const [topics, setRelatedTopics] = useState<Record<number, Topic>>({})
  const [boards, setRelatedBoards] = useState<Record<number, Board>>({})

  const [meta, setMeta] = useState<IPaginationMeta | undefined>()

  useEffect(() => {
    fetch('/api/last-messages?relations=board,user')
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
  }, [])

  return (
    <>
      <h1>JQ Forum</h1>
      {messages.map(message => (
        <Styled.Message>
          <h4>Date: {message.createdAt}</h4>
          <h6>Author: {users[message.linksId.user]?.displayName ?? users[message.linksId.user]?.login}</h6>
          <div>{message.body}</div>
        </Styled.Message>
      ))}
    </>
  )
}

render(<App/>, document.getElementById('app'))
