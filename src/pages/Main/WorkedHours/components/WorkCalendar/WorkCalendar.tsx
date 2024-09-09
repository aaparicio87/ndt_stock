import { Calendar, dateFnsLocalizer, Event, Views } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useWorkedHoursContext } from "../../../../../context/WorkedHoursContext.tsx";
import { Box } from "@chakra-ui/react";

const locales = {
  "en-US": enUS,
};

const localize = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const WorkCalendar = () => {
  const {
    onOpen,
    handleWorkHoursSelected,
    userWorkHours,
    onViewChange,
    onNavigate,
  } = useWorkedHoursContext();

  const handleSelectEvent = (e: Event) => {
    const { resource } = e;
    const ws: TWorkHour = {
      ...resource,
    };
    handleWorkHoursSelected(ws);
    onOpen();
  };

  return (
    <Box
      maxW={{ xl: "120vw", lg: "90vw", md: "95vw", sm: "80" }}
      minWidth={{ xl: "90vw", lg: "80vw", md: "80vw", sm: "75vw" }}
      overflowX={"auto"}
      overflowY={"auto"}
      height={"70vh"}
    >
      <Calendar
        localizer={localize}
        events={userWorkHours}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        onView={onViewChange}
        onNavigate={onNavigate}
      />
    </Box>
  );
};
export default WorkCalendar;
