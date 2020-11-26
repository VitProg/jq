import React, { useEffect, useState } from 'react'
import {render} from 'react-dom'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import { Layout } from './layout/Lyout'
import { CssBaseline } from '@material-ui/core'
import { GlobalStyle } from './GlobalStyle'
import { IocProvider } from './ioc/ioc.react'
import { container } from './ioc/ioc.container'

import './Tags/register-tags'
import './ioc'

const App = (props: {page?: number}) => {
  return (
    <IocProvider container={container}>
      <BrowserRouter>
        <CssBaseline/>
        <GlobalStyle/>
        <Layout/>
      </BrowserRouter>
    </IocProvider>
  )
}

render(<App/>, document.getElementById('app'))
