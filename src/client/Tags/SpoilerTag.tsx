import { Tag } from 'bbcode-to-react'
import { Spoiler } from '../components/ui-kit/spoiler/Spoiler'


export class SpoilerTag extends Tag {

  toReact() {
    console.log('Spoiler Tag params: ', this.params)
    // debugger

    return (
      <Spoiler title={(this.params as any)?.spoiler ?? ''} components={this.getComponents()}/>
    )
  }
}
