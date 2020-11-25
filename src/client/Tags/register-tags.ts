import parser, { Tag } from 'bbcode-to-react'
import { UserTag } from './UserTag'
import { YoutubeTag } from './YoutubeTag'


parser.registerTag('user', UserTag as any)
parser.registerTag('youtube', YoutubeTag as any)
