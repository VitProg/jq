import React, { FC, FormEvent, useRef, useState } from 'react'
import { Backdrop, Button, Fade, FormControlLabel, Grid, Link, makeStyles, Modal, TextField, Theme, Checkbox, Typography, Avatar } from '@material-ui/core'
import { LockOutlined } from '@material-ui/icons'
import { observer } from 'mobx-react-lite'
import { useInjection } from '../../ioc/ioc.react'
import { IApiService, LoginRequest } from '../../services/interfaces'
import { ApiServiceSymbol } from '../../ioc/ioc.symbols'
import { useStore } from '../../hooks/use-store'


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
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    outline: 'none',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    // width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))


interface Props {
  isOpen: boolean
  onClose: () => void
}

export const LoginModal: FC<Props> = observer(function LoginModal (props) {
  const classes = useStyles()

  const form = useRef<HTMLFormElement>(null)

  const apiService = useInjection<IApiService>(ApiServiceSymbol)

  const [formData, setFormData] = useState<Partial<LoginRequest>>({})

  const handleLoginClick = async (event: FormEvent) => {
    event.preventDefault()

    if (formData.username && formData.password) {
      const user = await apiService.login({
        username: formData.username,
        password: formData.password,
      })

      props.onClose()
    } else {
      //todo errors
    }

    //todo validation
    //todo send to apiService
  }

  return (
    <Modal
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
          <Avatar className={classes.avatar}>
            <LockOutlined/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Вход
          </Typography>
          <form ref={form as any} className={classes.form} onSubmit={handleLoginClick}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="login"
              label="Логин / Email"
              name="login"
              autoComplete="email"
              onChange={(event) => setFormData({
                ...formData,
                username: event.target.value.trim()
              })}
              value={formData?.username}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              onChange={(event) => setFormData({
                ...formData,
                password: event.target.value.trim()
              })}
              value={formData?.password}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary"/>}
              label="Запомнить меня"
            />
            <Button
              type="submit"
              size="large"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Войти
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Забыли пароль?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  Зарегистрироваться
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Fade>
    </Modal>
  )
})
