import React, { FC, useState } from 'react'
import { Tag } from 'bbcode-to-react'

interface Props {
  title?: string
  components: React.ReactNode[]
}
const Spoiler: FC<Props> = (props) => {
  const [open, setOpen] = useState(false)

  const title = props.title ?? 'Спойлер...'

  const onClick = () => {
    setOpen(!open)
  }

  return (
    <div>
      <div onClick={onClick}>{open ? '[-]' : '[+]'} {title}</div>
      {open && props.components}
    </div>
  )
}

export class SpoilerTag extends Tag {

  toReact() {
    console.log('Spoiler Tag params: ', this.params)
    // debugger

    return (
      <Spoiler title={(this.params as any)?.spoiler ?? ''} components={this.getComponents()}/>
    )
  }
}
