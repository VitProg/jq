import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core'


export const Header: FC = (props) => {

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            JQ Forum React
          </Typography>
          <Button variant="outlined" color="primary" component={Link} to="/messages">
            Last messages
          </Button>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </header>
  )
}

