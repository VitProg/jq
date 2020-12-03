import React, { FC } from 'react'
import { Avatar, Backdrop, Button, Fade, Grid, Link, makeStyles, Modal, TextField, Theme, Typography } from '@material-ui/core'
import { LockOutlined } from '@material-ui/icons'
import { observer } from 'mobx-react-lite'
import { useInjection } from '../../ioc/ioc.react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User } from '../../../common/forum/models/user'
import { store } from '../../store'
import { IAuthService } from '../../services/my/types'
import { AuthServiceSymbol } from '../../services/ioc.symbols'


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

const schema = z.object({
  username: z.string().nonempty('Введите ваш логин или email'),
  password: z.string().nonempty('Введите ваш пароль'),
  remember: z.boolean().optional(),
})

type Schema = z.infer<typeof schema>;

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const LoginModal: FC<Props> = observer(function LoginModal (props) {
  const classes = useStyles()

  const {
    errors,
    control,
    handleSubmit,
    setError,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const authService = useInjection<IAuthService>(AuthServiceSymbol)

  const onSubmit = async (data: Schema) => {
    let user: User | undefined

    try {
      user = await authService.login(data)
      if (store.routeStore.saved) {
        store.routeStore.replaceSaved()
      }
      props.onClose()
    } catch {
    } finally {
      if (!user) {
        setError('username', {
          message: 'Неверный логин и/или пароль',
          type: 'validate',
        })
      }
    }
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
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="normal"
              defaultValue=''
              fullWidth
              label="Логин / Email"
              name="username"
              autoComplete="email"
              autoFocus
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="normal"
              defaultValue=''
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            {/*<FormControlLabel*/}
            {/*  control={*/}
            {/*    <Controller*/}
            {/*      as={Checkbox}*/}
            {/*      control={control}*/}
            {/*      name='remember'*/}
            {/*      value="remember"*/}
            {/*      color="primary"*/}
            {/*    />*/}
            {/*  }*/}
            {/*  label="Запомнить меня"*/}
            {/*/>*/}
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
