import { Tag } from 'bbcode-to-react'
import React from 'react'


export class UserTag extends Tag {
  toReact() {
    const user = this.getContent(true)
    //todo
    return (
      <a href='#touser'>{user}</a>
    );
  }
}
