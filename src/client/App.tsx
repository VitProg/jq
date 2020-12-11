import { render } from 'react-dom'
import { Layout } from './layout/Lyout'
import { CssBaseline, ThemeProvider, useMediaQuery } from '@material-ui/core'
import { GlobalStyle } from './GlobalStyle'
import { IocProvider } from './ioc/ioc.react'
import { container } from './ioc/ioc.container'
import { AuthServiceSymbol, ForumServiceSymbol } from './services/ioc.symbols'
import { IAuthService } from './services/my/types'
import { IForumService } from './services/forum/types'


import { store } from './store'
import './Tags'
import './ioc'
import { observer } from 'mobx-react-lite'
import './utils/date'


const authService = container.get<IAuthService>(AuthServiceSymbol)

authService.refreshToken(true)
  .finally(() => {
    const App = observer(function App (props: { page?: number }) {
      const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
      store.uiStore.theme
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
