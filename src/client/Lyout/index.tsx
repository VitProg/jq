import React, { FC } from 'react'
import { Header } from '../Header'
import { Footer } from '../Footer'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { MessagesPage } from '../MessagesPage'


export const Layout: FC = (props) => {

  return (
    <section>
      <Header/>
      <section>
        <Switch>
          <Route path={["/messages/:page", "/messages"]} children={<MessagesPage/>}/>
        </Switch>
      </section>
      <Footer/>
    </section>
  )
}

