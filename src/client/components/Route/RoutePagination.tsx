import React, { FC } from 'react'
import { PaginationProps } from '@material-ui/lab/Pagination/Pagination'
import { Pagination, PaginationItem, PaginationRenderItemParams } from '@material-ui/lab'
import { Route } from 'type-route'
import { routes } from '../../routes'


type Props = PaginationProps & {
  route: (params: PaginationRenderItemParams) => Route<typeof routes>
}

export const RoutePagination: FC<Props> = (props) => {

  const { route, ...paginationProps } = props

  const renderItem = (item: PaginationRenderItemParams) => {
    if (item.type === 'end-ellipsis' || item.type === 'start-ellipsis') {
      return (<PaginationItem {...item}/>)
    }

    return (
      <PaginationItem
        {...item}
        component='a'
        {...route(item).link}
      />
    )
  }

  return (
    <Pagination
      {...paginationProps}
      renderItem={renderItem}
    />
  )
}
