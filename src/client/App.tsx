import React from 'react'
import { render } from 'react-dom'
import { Layout } from './layout/Lyout'
import { CssBaseline, ThemeProvider, useMediaQuery } from '@material-ui/core'
import { GlobalStyle } from './GlobalStyle'
import { IocProvider } from './ioc/ioc.react'
import { container } from './ioc/ioc.container'
import { AuthServiceSymbol, ForumServiceSymbol } from './services/ioc.symbols'
import { IAuthService } from './services/my/types'
import './Tags/register-tags'
import './ioc'
import { store } from './store'
import { observer } from 'mobx-react-lite'
import { IForumService } from './services/forum/types'
import { mute } from '../common/utils/promise'


const authService = container.get<IAuthService>(AuthServiceSymbol)

authService.refreshToken(true)
  .finally(() => {
    const App = observer(function App (props: { page?: number }) {
      const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
      store.uiStore.setDarkMode(prefersDarkMode)

      const forumService = container.get<IForumService>(ForumServiceSymbol)
      // forumService.prepare()

      return (
        <IocProvider container={container}>
          <ThemeProvider theme={store.uiStore.theme}>
            {/*<RouteProvider>*/}
            <CssBaseline/>
            <GlobalStyle/>
            <Layout/>
            {/*</RouteProvider>*/}
          </ThemeProvider>
        </IocProvider>
      )
    })

    render(<App/>, document.getElementById('app'))
  })
