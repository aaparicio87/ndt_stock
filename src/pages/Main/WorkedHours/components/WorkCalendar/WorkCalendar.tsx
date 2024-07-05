import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'

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

const WorkCalendar = () => {
   return (
       <Calendar
           localizer={localize}
           events={[]}
           startAccessor="start"
           endAccessor="end"
           style={{ height: 500 }}
       />
   )
}
export default WorkCalendar
