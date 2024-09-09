import React from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import { useParams } from "react-router-dom";
import { Loader } from "../../../../../components";
import { useStaffContext } from "../../../../../context/StaffContext";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";

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

const WorkHours = () => {
  const { id } = useParams<{ id: string }>();

  const {
    isLoading,
    handleUserHours,
    userWorkHours,
    onNavigate,
    onViewChange,
    visibleHours,
  } = useStaffContext();

  React.useEffect(() => {
    if (id) {
      handleUserHours(id);
    }
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box overflow="hidden" my={10} p={10}>
      <Flex
        direction={{ xl: "row", lg: "row", md: "column", sm: "column" }}
        justifyContent={{
          xl: "space-between",
          lg: "space-between",
          md: "center",
          sm: "center",
        }}
        width={{ xl: "50vw", lg: "47vw", md: "100%", sm: "100%" }}
        alignItems={{ md: "center", sm: "center" }}
        mb={5}
      >
        <Heading as="h3" size="lg" noOfLines={1}>
          Worked Hours
        </Heading>
        <Heading as="h2" size="md">
          Total: {visibleHours}
        </Heading>
      </Flex>
      <Stack alignItems={"center"}>
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
            style={{ height: 500 }}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            onView={onViewChange}
            onNavigate={onNavigate}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default WorkHours;
