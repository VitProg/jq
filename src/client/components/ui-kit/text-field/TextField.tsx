import React, { FC, useMemo } from 'react'
import { IconButton, InputAdornment, InputProps, TextField as MuiTextField } from '@material-ui/core'
import { TextFieldProps } from '@material-ui/core/TextField/TextField'
import { SvgIconComponent } from '@material-ui/icons'
import { Control, Controller, FieldErrors } from 'react-hook-form'


type Props = {
  name: string
  startIcon?: SvgIconComponent
  onStartIconClick?: () => void,
  endIcon?: SvgIconComponent
  onEndIconClick?: () => void,
  control?: Control
  errors?: FieldErrors
} & TextFieldProps

export const TextField: FC<Props> = (props) => {
  const {
    startIcon: StartIcon = undefined,
    endIcon: EndIcon = undefined,
    onStartIconClick,
    onEndIconClick,
    control,
    errors,
    ...inputProps
  } = props

  const adornments: InputProps = useMemo(() => ({
    startAdornment: StartIcon && (
      <InputAdornment position="start">
        {onStartIconClick ?
          <IconButton onClick={onStartIconClick}><StartIcon/></IconButton> :
          <StartIcon/>
        }
      </InputAdornment>
    ),
    endAdornment: EndIcon && (
      <InputAdornment position="end">
        {onEndIconClick ?
          <IconButton onClick={onEndIconClick}><EndIcon/></IconButton> :
          <EndIcon/>
        }
      </InputAdornment>
    ),
  }), [StartIcon, EndIcon, onStartIconClick, onEndIconClick])

  return control ?
    (
      <Controller
        as={MuiTextField}
        control={control}
        error={errors && errors[props.name as any]}
        helperText={errors ? errors[props.name as any]?.message : props.helperText}
        defaultValue=''
        {...inputProps}
        InputProps={adornments}
        onFocus={props.onFocus as ((() => void) | undefined)}
      />
    ) :
    (
      <MuiTextField
        defaultValue=''
        {...inputProps}
        InputProps={adornments}
      />
    )
}
