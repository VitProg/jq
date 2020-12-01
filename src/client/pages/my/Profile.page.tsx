import React, { FC, useEffect, useMemo, useState } from 'react'
import { RouteLink } from '../../components/Route/RouteLink'
import { useStore } from '../../hooks/use-store'
import { useInjection } from '../../ioc/ioc.react'
import { IApiService } from '../../services/interfaces'
import { ApiServiceSymbol } from '../../ioc/ioc.symbols'
import { User } from '../../../common/forum/entities/user'
import { IUser } from '../../../common/forum/forum.interfaces'



export const ProfilePage: FC = (props) => {

  const apiService = useInjection<IApiService>(ApiServiceSymbol)

  const [user, setUser] = useState<IUser | undefined>()

  if (!user) {
    apiService.profile()
      .then(user => {
        setUser(user)
      })
  }

  return user ? (
    <div>
      {user.id}: {user.login}
    </div>
  ) : null
}
