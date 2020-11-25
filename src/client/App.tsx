import React, { useEffect, useState } from 'react'
import {render} from 'react-dom'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import { Layout } from './Lyout'
import { CssBaseline } from '@material-ui/core'
import { GlobalStyle } from './GlobalStyle'


const App = (props: {page?: number}) => {
  return (
    <BrowserRouter>
      <CssBaseline/>
      <GlobalStyle/>
      <Layout/>
    </BrowserRouter>
  )
}

render(<App/>, document.getElementById('app'))
