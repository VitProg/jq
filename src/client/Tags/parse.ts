import parser from 'bbcode-to-react'


export const parseBBCodes = (message: string) => parser
  .toReact(message
    .replace(/<br\s*\/?>/gm, '\n')
    .split('&nbsp;').join(' ')
    .split('&quot;').join('"')
  )
