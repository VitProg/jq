import { useEffect, useState, Dispatch, SetStateAction } from 'react'


export const usePage = (props: { page?: number }): [page: number, setPage: Dispatch<SetStateAction<number>>] => {
  const routePage = props.page ?? 1

  const [page, setPage] = useState(routePage)

  useEffect(() => {
    setPage(routePage)
  }, [routePage])

  return [page, setPage]
}
