import React, { FC } from 'react'
import { Board, Message, User } from '../common/forum/forum.entities'
import * as Styled from './styled'


interface ExternalProps {
  message: Message
  relatedUser?: User
  relatedBoard?: Board
  loading?: boolean
}

type Props = ExternalProps

export const MessageItem: FC<Props> = (props) => {

  const {
    message,
    relatedBoard,
    relatedUser,
    loading = false,
  } = props

  return (
    <Styled.Message key={message.id} loading={loading ? 1 : 0}>
      <h4>Date: {message.createdAt}</h4>
      <h6>Board: {`${relatedBoard?.category?.name} / ${relatedBoard?.name}`}</h6>
      <h6>Author: {relatedUser?.displayName ?? relatedUser?.login}</h6>
      <div>{message.body}</div>
    </Styled.Message>
  )
}
