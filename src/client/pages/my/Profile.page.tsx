import React, { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { store } from '../../store'


export const ProfilePage: FC = observer(function ProfilePage (props) {
  const user = store.userStore.user

  return user ? (
    <div>
      {user.id}: {user.login}
    </div>
  ) : null
})
