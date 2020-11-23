import styled from 'styled-components'


export const Message = styled.div`
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
`
