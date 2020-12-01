import React, { FC } from 'react'
import { Box } from '@material-ui/core'
import { IMessage } from '../../../common/forum/forum.interfaces'
import { MessageRelationsRecord } from '../../../common/forum/forum.entity-relations'
import { MessageItem } from './MessageItem'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../hooks/use-store'
import { Skeleton } from '@material-ui/lab'
import { MessageItemSkeleton } from './MessageItemSkeleton'


interface Props {
  messages: IMessage[]
  relations?: MessageRelationsRecord
}

const skeletons = [79, 120, 60, 100, 88]

export const MessageList: FC<Props> = observer(function MessageList (props) {
  const { uiStore } = useStore()

  return (
    <Box component="section" m={1}>
      {uiStore.loading
        ? (skeletons).map((h) => (
          <MessageItemSkeleton messageHeight={h}/>
        ))
        : props.messages.map(message => (
            <MessageItem
              key={message.id}
              message={message}
              relations={{
                topic: props.relations?.topic?.[message.linksId.topic],
                board: props.relations?.board?.[message.linksId.board],
                user: props.relations?.user?.[message.linksId.user],
              }}
            />
          )
        )
      }
    </Box>
  )
})
