import { FC } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { RouterSwitch } from '../RouterSwitch'
import { Container } from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import { PageBreadcrumbs } from '../components/page-breadcrumbs/PageBreadcrumbs'
import { PageTitle } from '../components/page-title/PageTitle'
import { useLayoutStyles } from './styles'


export const Layout: FC = observer((props) => {

  const classes = useLayoutStyles()

  return (
    <main className={classes.body}>
      <Header/>
      <Container maxWidth="md" className={classes.container}>
        <PageTitle/>
        <PageBreadcrumbs/>
        <RouterSwitch/>
        <PageBreadcrumbs/>
      </Container>
      <Footer/>
    </main>
  )
})

