import { FC, ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Container, List, ListItem, ListItemText, Typography } from '@material-ui/core'
import { RouteLink } from '../components/route/RouteLink'
import { store } from '../store'
import { IBoard, ICategory } from '../../common/forum/forum.interfaces'
import { usePageMetadata } from '../hooks/use-page-metadata'
import { BoardList } from '../components/board/board-list/BoardList'


interface Props {
}

export const BoardListPage: FC<Props> = observer(function BoardListPage (props: Props) {

  usePageMetadata({
    pageTitle: 'Разделы форума',
    setSeoTitle: false,
    setBreadcrumbs: false,
  })

  return (
    <Container>
      <BoardList/>
    </Container>
  )
})
