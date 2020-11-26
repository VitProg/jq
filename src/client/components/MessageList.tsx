import React, { FC } from 'react'
import { Box } from '@material-ui/core'
import { IMessage } from '../../common/forum/forum.interfaces'
import { MessageRelationsRecord } from '../../common/forum/forum.entity-relations'
import { MessageItem } from './MessageItem'
import { observer } from 'mobx-react-lite'
import { useStore } from '../hooks/use-store'


interface Props {
  messages: IMessage[]
  relations?: MessageRelationsRecord
}

export const MessageList: FC<Props> = observer(function MessageList (props) {
  const { ui } = useStore()

  return (
    <Box component="section" m={1}>
      {ui.loading && <div>Loading...</div>}
      {props.messages.map(message => (
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
      )}
    </Box>
  )
})
