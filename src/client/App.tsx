import React, { useEffect, useState } from 'react'
import {render} from 'react-dom'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import { MessagesPage } from './MessagesPage'


const App = (props: {page?: number}) => {


  return (
    <BrowserRouter>
      <h1>JQ Forum React</h1>
      <nav>
        <li><Link to="/messages">Last messages</Link></li>
        <li><Link to="/messages/2">Last messages Page2</Link></li>
      </nav>
      <Switch>
        <Route path={["/messages/:page"]} children={<MessagesPage/>}/>
        <Route path={["/messages"]} children={<MessagesPage/>}/>
      </Switch>
    </BrowserRouter>
  )
}

render(<App/>, document.getElementById('app'))
