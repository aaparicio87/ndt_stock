import React from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import { useUser } from '../../hooks/useUsers'
import { useParams } from 'react-router-dom'
import { Loader } from '../../../../../components'

const locales = {
  'en-US': enUS,
}

const localize = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})


const WorkHours = () => {

  const { id } = useParams<{ id: string }>();

  const {
    isLoading,
    handleUserHours,
    userWorkHours
  } = useUser()

  React.useEffect(() => {
    if (id) {
      handleUserHours(id)
    }
  }, [id])


  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Calendar
        localizer={localize}
        events={userWorkHours}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />

    </>
  )
}

export default WorkHours