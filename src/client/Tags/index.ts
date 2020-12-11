import parser, { Tag } from 'bbcode-to-react'
import { UserTag } from './UserTag'
import { YoutubeTag } from './YoutubeTag'
import { HtmlTag } from './HtmlTag'
import { SpoilerTag } from './SpoilerTag'
import { QuoteTag } from './QuoteTag'


parser.registerTag('spoiler', SpoilerTag as any)
parser.registerTag('html', HtmlTag as any)
parser.registerTag('user', UserTag as any)
parser.registerTag('youtube', YoutubeTag as any)
parser.registerTag('quote', QuoteTag as any)
