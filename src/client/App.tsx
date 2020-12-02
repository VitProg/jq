import React from 'react'
import { render } from 'react-dom'
import { Layout } from './layout/Lyout'
import { CssBaseline } from '@material-ui/core'
import { GlobalStyle } from './GlobalStyle'
import { IocProvider } from './ioc/ioc.react'
import { container } from './ioc/ioc.container'
import { AuthServiceSymbol } from './services/ioc.symbols'
import { IAuthService } from './services/my/types'
import './Tags/register-tags'
import './ioc'


const authService = container.get<IAuthService>(AuthServiceSymbol)

authService.refreshToken(true)
  .finally(() => {
    const App = (props: { page?: number }) => {
      return (
        <IocProvider container={container}>
          {/*<RouteProvider>*/}
          <CssBaseline/>
          <GlobalStyle/>
          <Layout/>
          {/*</RouteProvider>*/}
        </IocProvider>
      )
    }

    render(<App/>, document.getElementById('app'))
  })
