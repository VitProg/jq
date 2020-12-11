import { FC } from 'react'
import { Button, Grid, Link, Typography } from '@material-ui/core'
import { AccountCircleOutlined, VpnKeyOutlined } from '@material-ui/icons'
import { observer } from 'mobx-react-lite'
import { useInjection } from '../../../ioc/ioc.react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User } from '../../../../common/forum/models/user'
import { store } from '../../../store'
import { IAuthService } from '../../../services/my/types'
import { AuthServiceSymbol } from '../../../services/ioc.symbols'
import { useStyles } from './styles'
import { Modal } from '../../../components/modal/Modal'
import { RouteLink } from '../../../components/route/RouteLink'
import { ModalProps } from '../../../components/types'
import { TextField } from '../../../components/ui-kit/text-field/TextField'
import { PasswordInput } from '../../../components/ui-kit/password-input/PasswordInput'


const schema = z.object({
  username: z.string().nonempty('Введите ваш логин или email'),
  password: z.string().nonempty('Введите ваш пароль'),
  remember: z.boolean().optional(),
})

type Schema = z.infer<typeof schema>;

type Props = ModalProps

export const LoginModal: FC<Props> = observer(function LoginModal (props) {
  store.seoStore.setTitle('Вход')

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
        store.routeStore.saved.replace()
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
      isOpen={props.isOpen}
      onClose={props.onClose}
      classNames={{paper: classes.modalPaper}}
      form={{
        onSubmit: handleSubmit(onSubmit)
      }}

      header={
        <Typography component="h1" variant="h5">
          Вход
        </Typography>
      }

      content={
        <>
          <TextField
            name='username'
            label="Логин / Email"
            control={control}
            errors={errors}
            margin="normal"
            fullWidth
            autoComplete="email"
            autoFocus
            startIcon={AccountCircleOutlined}
          />
          <PasswordInput
            name='password'
            label="Пароль"
            control={control}
            errors={errors}
            margin="normal"
            fullWidth
            autoComplete="current-password"
            startIcon={VpnKeyOutlined}
          />
        </>
      }

      footer={
        <>
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
              <RouteLink to={'forgotPassword'} component={Link} variant="body2">
                Забыли пароль?
              </RouteLink>
            </Grid>
            <Grid item>
              <RouteLink to={'registration'} component={Link} variant="body2">
                Зарегистрироваться
              </RouteLink>
            </Grid>
          </Grid>
        </>
      }
    />
  )
})
