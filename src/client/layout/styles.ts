import { makeStyles, Theme } from '@material-ui/core'


export const useLayoutStyles = makeStyles((theme: Theme) => (
  {
    body: {
      paddingTop: theme.spacing(11),
      paddingBottom: theme.spacing(10),
      backgroundColor: theme.palette.accent.light,
      [theme.breakpoints.down('sm')]: {
        backgroundColor: theme.palette.background.paper,
      }
    },
    container: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(2, 1),

      [theme.breakpoints.down('sm')]: {
        boxShadow: 'none',
        borderRadius: 0,
      }
    }
  }
))

export const useHeaderStyles = makeStyles((theme: Theme) => (
  {
    container: {

    },
    toolbar: {
      display: 'flex',
    },
    grow: {
      flex: 1
    },
    title: {

    },
    menu: {
      textAlign: 'center'
    },
    userArea: {

    },
  }
))
