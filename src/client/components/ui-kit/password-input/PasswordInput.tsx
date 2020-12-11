import { FC, useCallback, useMemo, useState } from 'react'
import { IconButton, InputAdornment, InputProps, TextField } from '@material-ui/core'
import { TextFieldProps } from '@material-ui/core/TextField/TextField'
import { SvgIconComponent, Visibility, VisibilityOff, VpnKeyOutlined } from '@material-ui/icons'
import { Control, Controller, FieldErrors } from 'react-hook-form'


type Props = {
  name: string
  startIcon?: SvgIconComponent
  onStartIconClick?: () => void,
  withShowPassword?: boolean
  control?: Control
  errors?: FieldErrors
} & TextFieldProps

export const PasswordInput: FC<Props> = (props) => {
  const {
    startIcon : StartIcon = undefined,
    onStartIconClick,
    withShowPassword = true,
    control,
    errors,
    ...inputProps
  } = props

  const [passwordShowed, setPasswordShowed] = useState(false)

  const showPassword = useCallback(() => {
    setPasswordShowed(true)
  }, [])

  const hidePassword = useCallback(() => {
    setPasswordShowed(false)
  }, [])

  const adornments: InputProps = useMemo(() => ({
    startAdornment: StartIcon && (
      <InputAdornment position="start">
        {onStartIconClick ?
          <IconButton onClick={onStartIconClick}><StartIcon/></IconButton> :
          <StartIcon/>
        }
      </InputAdornment>
    ),
    endAdornment: withShowPassword && (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onMouseDown={showPassword}
          onMouseUp={hidePassword}
        >
          {passwordShowed ? <Visibility/> : <VisibilityOff/>}
        </IconButton>
      </InputAdornment>
    ),
  }), [StartIcon, onStartIconClick, withShowPassword, passwordShowed])

  const hasError = !!(errors && errors[props.name as any])

  return control ?
    (
      <Controller
        as={TextField}
        control={control}
        error={hasError}
        helperText={errors ? errors[props.name as any]?.message : props.helperText}
        defaultValue=''
        autoComplete="current-password"
        {...inputProps}
        type={passwordShowed ? 'text' : 'password'}
        InputProps={adornments}
        onFocus={props.onFocus as ((() => void) | undefined)}
      />
    ) :
    (
      <TextField
        defaultValue=''
        autoComplete="current-password"
        {...inputProps}
        type={passwordShowed ? 'text' : 'password'}
        InputProps={adornments}
      />
    )
}
