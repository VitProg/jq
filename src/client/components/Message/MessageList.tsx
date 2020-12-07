import React, { FC } from 'react'
import { Box } from '@material-ui/core'
import { IMessage } from '../../../common/forum/forum.interfaces'
import {
  MessageRelations,
  MessageRelationsRecord,
  MessageRelationsSingle
} from '../../../common/forum/forum.entity-relations'
import { MessageItem } from './MessageItem'
import { observer } from 'mobx-react-lite'
import { MessageItemSkeleton } from './MessageItemSkeleton'


interface Props {
  messages?: IMessage[]
  relations?: MessageRelationsRecord
}

const skeletons = [79, 120, 60, 100, 88]

const getRelations = (message: IMessage, relations?: MessageRelationsRecord) => {
  const result: MessageRelationsSingle = {
    topic: relations?.topic?.[message.linksId.topic],
    board: relations?.board?.[message.linksId.board],
    user: relations?.user?.[message.linksId.user],
  }

  const categoryId = result.board?.linksId.category
  if (categoryId && relations?.category) {
    result.category = relations?.category[categoryId]
  }

  return result
}

export const MessageList: FC<Props> = observer(function MessageList (props) {

  return (
    <Box component="section" m={1}>
      {
        !props.messages
          ?
          (skeletons).map((h) => (
            <MessageItemSkeleton key={h} messageHeight={h}/>
          ))
          :
          props.messages.map(message => (
              <MessageItem
                key={message.id}
                message={message}
                relations={getRelations(message, props.relations)}
              />
            )
          )
      }
    </Box>
  )
})
