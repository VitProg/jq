import React, { FC, useState } from 'react'
import { dayjs } from '../../utils/date'
import useDate from '../../hooks/use-date'


interface Props {
  date?: Date
  format?: string
  withoutSuffix?: boolean
  toggleable?: boolean
}

export const FromNowDate: FC<Props> = (props) => {
  const {
    date,
    format = 'lll',
    toggleable = true,
    withoutSuffix = false
  } = props

  if (!date) {
    return null
  }

  const d = dayjs(date)
  const formatted = d.format(format)
  const rel = d.fromNow(withoutSuffix)
  const iso = d.toISOString()

  if (rel === formatted) {
    return (<time dateTime={iso}>{formatted}</time>)
  }

  if (!toggleable) {
    return (<time dateTime={iso} title={formatted}>{rel}</time>)
  }

  const [showRel, setShowRel] = useState(true)

  const toggleShowRel = () => setShowRel(!showRel)

  const now = useDate({interval: 'minute'})

  return (<time data-now={now.toISOString()} style={{cursor: 'pointer'}} dateTime={iso} onClick={toggleShowRel} title={showRel ? formatted : ''}>{showRel ? rel : formatted}</time>)
}
