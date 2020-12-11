import { observer } from 'mobx-react-lite'
import { store } from '../../store'
import { Box, Breadcrumbs, Container, Typography } from '@material-ui/core'
import { HomeOutlined } from '@material-ui/icons'
import { RouteLink } from '../route/RouteLink'
import { isString } from '../../../common/type-guards'
import { useStyles } from './styles'


export const PageBreadcrumbs = observer(function PageBreadcrumbs () {
  const classes = useStyles()

  return (
    <>
      {store.breadcrumbsStore.has &&
      <Container>
        <Box className={classes.container}>
          <Breadcrumbs aria-label='breadcrumbs' className={classes.breadcrumbs}>
            <RouteLink to={'index'} className={classes.iconLink}><HomeOutlined className={classes.icon}/></RouteLink>
            {store.breadcrumbsStore.items.map((item, index) => (
              isString(item) ?
                (<Typography className={classes.item} key={index} color="textPrimary">{item}</Typography>) :
                (<RouteLink className={classes.item} key={index} to={item.route} route={item.routeProps}>{item.label}</RouteLink>)
            ))}
          </Breadcrumbs>
        </Box>
      </Container>}
    </>
  )
})
