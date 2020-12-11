import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { IUser } from '../../../common/forum/forum.interfaces'
import { getUserName } from '../../../common/forum/utils'
import { UserLink } from './UserLink'
import { isString } from '../../../common/type-guards'
import { store } from '../../store'

interface Props {
  user: string | IUser
}

export const UserMention: FC<Props> = observer(function UserMention(props) {

  const user = isString(props.user) ?
    (store.forumStore.userStore.getByName(props.user) ?? props.user) :
    props.user

  return (
    <UserLink user={user}>@{isString(user) ? user : getUserName(user)}</UserLink>
  )
})
