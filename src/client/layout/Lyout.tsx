import React, { FC } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { RouterSwitch } from '../RouterSwitch'
import { Container } from '@material-ui/core'


export const Layout: FC = (props) => {

  return (
    <section>
      <Header/>
      <Container>
        <RouterSwitch/>
      </Container>
      <Footer/>
    </section>
  )
}

