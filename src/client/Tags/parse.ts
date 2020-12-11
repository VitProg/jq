import parser from 'bbcode-to-react'


export const parseBBCodes = (message: string) => parser
  .toReact(message
    .replace(/<br\s*\/?>/gm, '\n')
    .split('&nbsp;').join(' ')
    .split('&quot;').join('"')
    .replace(/^@([\w\d_-]+)/gm, '[user]$1[/user]')
    .replace(/([\s+])@([\w\d_-]+)/gm, '$1[user]$2[/user]')
  )
