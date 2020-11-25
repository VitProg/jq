import React, { useEffect, useState } from 'react'
import {render} from 'react-dom'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import { MessagesPage } from './MessagesPage'
import { Layout } from './Lyout'


const App = (props: {page?: number}) => {


  return (
    <BrowserRouter>
      <Layout/>
    </BrowserRouter>
  )
}

render(<App/>, document.getElementById('app'))
