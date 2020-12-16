import { createStyles, makeStyles, Theme } from '@material-ui/core'

interface Props {
  level?: number
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    left: {

    },
    body: (props: Props) => (props.level && props.level > 0 ? {marginLeft: theme.spacing(2 * props.level)} : {}),
  })
)
