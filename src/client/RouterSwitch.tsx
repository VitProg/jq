import React, {FC} from 'react'
import { Route, Switch } from 'react-router-dom'
import { LastMessagesPage } from './pages/LastMessages.page'

export const RouterSwitch: FC = () => {
  return (
    <Switch>
      <Route path={["/messages/:page", "/messages"]} children={<LastMessagesPage/>}/>
    </Switch>
  )
}
