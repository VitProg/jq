import { IBoard } from '../../../../common/forum/forum.interfaces'
import { omit } from '../../../../common/utils/object'


export const boardWithoutGroups = (board: IBoard): IBoard => {
  return {
    ...board,
    settings: {
      ...omit(board.settings, 'forGroups', 'onlyIndexGroups'),
    }
  }
}
