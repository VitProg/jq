import React, { FC } from 'react'
import { Button, Grid, Link, Typography } from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import { useInjection } from '../../../ioc/ioc.react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { IAuthService } from '../../../services/my/types'
import { AuthServiceSymbol } from '../../../services/ioc.symbols'
import { useStyles } from './styles'
import { Modal } from '../../../components/Modal/Modal'
import { RouteLink } from '../../../components/Route/RouteLink'
import { ModalProps } from '../../../components/types'
import { AccountCircleOutlined, AlternateEmailOutlined, VpnKeyOutlined } from '@material-ui/icons'
import { PasswordInput } from '../../../components/ui-kit/password-input/PasswordInput'
import { TextField } from '../../../components/ui-kit/text-field/TextField'
import { store } from '../../../store'


const schema = z.object({
  email: z.string().nonempty('Введите ваш email'),
})

type Schema = z.infer<typeof schema>;

type Props = ModalProps

export const ForgotPasswordModal: FC<Props> = observer(function ForgotPasswordModal (props) {
  store.seoStore.setTitle('Восстановление пароля')

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
    debugger
    // todo
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      classNames={{paper: classes.modalPaper}}
      form={{
        onSubmit: handleSubmit(onSubmit)
      }}

      header={() => (
        <Typography component="h1" variant="h5">
          Восстановление пароля
        </Typography>
      )}

      content={() => (
        <>
          <TextField
            name='email'
            label="Email"
            control={control}
            errors={errors}
            margin="normal"
            fullWidth
            autoComplete="email"
            startIcon={AlternateEmailOutlined}
            autoFocus
          />
        </>
      )}

      footer={() => (
        <>
          <Button
            type="submit"
            size="large"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Восстановить
          </Button>
          <Grid container>
            <Grid item xs>
              <RouteLink to={'login'} component={Link} variant="body2">
                Войти
              </RouteLink>
            </Grid>
            <Grid item>
              <RouteLink to={'registration'} component={Link} variant="body2">
                Зарегистрироваться
              </RouteLink>
            </Grid>
          </Grid>
        </>
      )}
    />
  )
})
