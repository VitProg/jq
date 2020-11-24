import React from 'react'
import styled, {css} from 'styled-components'

type MessageProps = {loading: any}

export const Message = styled.div<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement> & MessageProps, HTMLDivElement>>`
  background-color: #a9bacb;
  border-radius: 4px;
  
  padding: 15px 20px;
  
  font-size: 14px;
  line-height: 1.25;
  
  color: #333333;
  
  & a {
    color: #2e3845;
  }
  
  & + & {
    margin-top: 20px;
  }
  
  & * {
    opacity: 1;
    transition: opacity 300ms 500ms;
  }

  ${({loading}) => loading
    && css`
        & * {
          opacity: 0;
        }
      `
  }
`

