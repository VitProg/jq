import { Backdrop, Fade, makeStyles, Modal as MUIModal, Theme } from '@material-ui/core'
import React, { ComponentType, FC } from 'react'


const useStyles = makeStyles((theme: Theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    outline: 'none',
  },
  header: {},
  content: {},
  footer: {}
}))


interface Props {
  isOpen: boolean
  onClose: () => void
  header?: () => ((props: ComponentType<any>) => React.ReactNode) | React.ReactNode
  content?: () => ((props: ComponentType<any>) => React.ReactNode) | React.ReactNode
  footer?: () => ((props: ComponentType<any>) => React.ReactNode) | React.ReactNode
}

export const Modal: FC<Props> = function Modal (props) {
  const classes = useStyles()

  return (
    <MUIModal
      open={props.isOpen}
      onClose={props.onClose}
      className={classes.modal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.isOpen}>
        <div className={classes.paper}>
          {props.header && props.header()}
          {props.content && props.content()}
          {props.children}
          {props.footer && props.footer()}
        </div>
      </Fade>
    </MUIModal>
  )
}
