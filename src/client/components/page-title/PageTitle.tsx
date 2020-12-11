import { observer } from 'mobx-react-lite'
import { store } from '../../store'
import { Box, Container, Typography } from '@material-ui/core'
import { useStyles } from './styles'


export const PageTitle = observer(function PageTitle () {

  const classes = useStyles()

  return (
    <>
      {store.uiStore.pageTitle &&
      <Container className={classes.container}>
        <Typography variant='h6' component='h1'>{store.uiStore.pageTitle}</Typography>
      </Container>}
    </>
  )
})
