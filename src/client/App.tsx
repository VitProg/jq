import React from 'react'
import { render } from 'react-dom'
import { RouteProvider } from './routes'
import { Layout } from './layout/Lyout'
import { CssBaseline } from '@material-ui/core'
import { GlobalStyle } from './GlobalStyle'
import { IocProvider } from './ioc/ioc.react'
import { container } from './ioc/ioc.container'

import './Tags/register-tags'
import './ioc'
import { ApiServiceSymbol } from './ioc/ioc.symbols'
import { IApiService } from './services/interfaces'
import { IRootStore } from './store/types'


const apiService = container.get<IApiService>(ApiServiceSymbol)
// const rootStore = container.get<IRootStore>(RootStoreSymbol)

apiService.refreshToken(true)
  .finally(() => {
    const App = (props: { page?: number }) => {
      return (
        <IocProvider container={container}>
          <RouteProvider>
            <CssBaseline/>
            <GlobalStyle/>
            <Layout/>
          </RouteProvider>
        </IocProvider>
      )
    }

    render(<App/>, document.getElementById('app'))
  })
