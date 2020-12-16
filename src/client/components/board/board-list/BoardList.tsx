import { FC, ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { List, ListItem, ListItemText, Typography } from '@material-ui/core'
import { store } from '../../../store'
import { BoardItem } from '../board-item/BoardItem'
import { IBoardEx } from '../../../../common/forum/forum.ex.interfaces'


interface Props {
  boards?: IBoardEx[],
  categories?: boolean
}

export const BoardList: FC<Props> = observer(function BoardList (props) {
  const {
    boards = store.forumStore.boardStore.getAll(false, 0),
    categories: showCategories = true,
  } = props

  // const categories = showCategories ? store.forumStore.categoryStore.getAll(true) : undefined

  let lastCategory: IBoardEx['category'] | undefined

  return (
    <List>
      {boards.map((board) => {
        let categoryElement: ReactElement | null = null

        if (showCategories && (!lastCategory || board.category.id !== lastCategory.id)) {
          lastCategory = board.category

          if (lastCategory) {
            categoryElement = <ListItem key={`cat-${lastCategory.id}|${board.id}`}>
              <ListItemText
                primary={<Typography variant='h5' component='span'>{lastCategory.name}</Typography>}
              />
            </ListItem>
          }
        }

        return (
          <>
            {categoryElement}
            <BoardItem board={board} key={`board-${board.id}`} level/>
          </>
        )
      })}
    </List>
  )
})
