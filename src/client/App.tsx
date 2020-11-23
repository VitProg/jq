import React, { useEffect, useState } from 'react'
import {render} from 'react-dom'
import { Board, Message, Topic, User } from '../common/forum.entities'
import { LastMessageResponse } from '../common/forums.responses'
import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces'
import * as Styled from './styled'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import { MessagesPage } from './MessagesPage'


const App = (props: {page?: number}) => {


  return (
    <BrowserRouter>
      <h1>JQ Forum React</h1>
      <nav>
        <li><Link to="/messages">Last messages</Link></li>
      </nav>
      <Switch>
        <Route path={["/messages", "/messages/:page"]} children={<MessagesPage/>}/>
      </Switch>
    </BrowserRouter>
  )
}

render(<App/>, document.getElementById('app'))
