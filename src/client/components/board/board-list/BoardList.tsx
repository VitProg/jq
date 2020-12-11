import { FC, ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { IBoard, ICategory } from '../../../../common/forum/forum.interfaces'
import { RouteLink } from '../../route/RouteLink'
import { Box, List, ListItem, ListItemText, Typography } from '@material-ui/core'
import { store } from '../../../store'
import { BoardItem } from '../board-item/BoardItem'


interface Props {
  boards?: IBoard[],
  categories?: boolean
}

export const BoardList: FC<Props> = observer(function BoardList (props) {
  const {
    boards = store.forumStore.boardStore.getAll(false),
    categories: showCategories = true,
  } = props

  const categories = showCategories ? store.forumStore.categoryStore.getAll(true) : undefined

  let lastCategory: ICategory | undefined

  return (
    <List>
      {boards.map((board) => {
        let categoryElement: ReactElement | null = null

        if (showCategories && (!lastCategory || board.linksId.category !== lastCategory.id)) {
          lastCategory = categories![board.linksId.category]

          if (lastCategory) {
            categoryElement = <ListItem key={`cat-${lastCategory.id}`}>
              <ListItemText
                primary={<Typography variant='h5' component='div'>{lastCategory.name}</Typography>}
              />
            </ListItem>
          }
        }

        return (
          <>
            {categoryElement}
            <BoardItem board={board} key={`board-${board.id}`}/>
          </>
        )
      })}
    </List>
  )
})
