import { Tag } from 'bbcode-to-react'
import { Quote } from '../components/ui-kit/quote/Quote'


export class QuoteTag extends Tag {
  toReact () {
    console.log('Quote Tag params: ', this.params)

    return (
      <Quote>{this.getComponents()}</Quote>
    )
  }
}
