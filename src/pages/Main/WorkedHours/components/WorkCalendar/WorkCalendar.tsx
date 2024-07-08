import React from "react";
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {useWorkedHoursContext} from "../../../../../context/WorkedHoursContext.tsx";


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

type TProps = {
    wHours: TWorkHour[] | undefined
}

const WorkCalendar = ({wHours}:TProps) => {
    const { onOpen, handleWorkHoursSelected } = useWorkedHoursContext()

    const events:Event[] =  React.useMemo(()=> {
       if(wHours){
           return wHours.map((wh) => {
               const start = new Date(`${wh.date}T${wh.startTime}:00`)
               const end = new Date(`${wh.date}T${wh.endTime}:00`)
               return {
                   title: wh.client.name,
                   start,
                   end,
                   resource: {
                       ...wh,
                   }
               }
           })
       }else{
           return  []
       }
    }, [wHours])

    const handleSelectEvent = (e:Event) => {
        const {resource} = e
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
               events={events}
               startAccessor="start"
               endAccessor="end"
               style={{ height: 500 }}
               onSelectEvent={handleSelectEvent}

           />
       </>
   )
}
export default WorkCalendar
