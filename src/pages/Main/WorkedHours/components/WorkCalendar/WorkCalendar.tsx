import { Calendar, dateFnsLocalizer, Event, Views } from 'react-big-calendar'
import { format } from 'date-fns/format'
import { parse } from 'date-fns/parse'
import { startOfWeek } from 'date-fns/startOfWeek'
import { getDay } from 'date-fns/getDay'
import { enUS } from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useWorkedHoursContext } from "../../../../../context/WorkedHoursContext.tsx";


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
    const {
        onOpen,
        handleWorkHoursSelected,
        userWorkHours,
        onViewChange,
        onNavigate
    } = useWorkedHoursContext()

    const handleSelectEvent = (e: Event) => {
        const { resource } = e
        const ws: TWorkHour = {
            ...resource
        }
        handleWorkHoursSelected(ws)
        onOpen()
    }

    return (
        <>
            <Calendar
                localizer={localize}
                events={userWorkHours}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectEvent={handleSelectEvent}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                onView={onViewChange}
                onNavigate={onNavigate}
            />
        </>
    )
}
export default WorkCalendar
