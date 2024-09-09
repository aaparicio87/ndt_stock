import WorkCalendar from "./components/WorkCalendar/WorkCalendar.tsx";
import { Box, Button, Flex, Heading, Stack } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import ModalEdit from "./components/ModalEdit/ModalEdit.tsx";
import { useWorkedHoursContext } from "../../../context/WorkedHoursContext.tsx";

const WorkedHours = () => {
  const { handleOpenEditWorkHour, isOpen, handleCloseModal, visibleHours } =
    useWorkedHoursContext();

  return (
    <Box overflow="hidden" my={10} p={10}>
      <Flex justifyContent={"space-between"}>
        <Flex
          direction={{ xl: "row", lg: "row", md: "column", sm: "column" }}
          justifyContent={{
            xl: "space-between",
            lg: "space-between",
          }}
          width={{ xl: "55vw", lg: "55vw", md: "100%", sm: "100%" }}
          alignItems={{ md: "center", sm: "center" }}
          mb={5}
          ml={{ xl: 0, lg: 0, md: 10, sm: 10 }}
        >
          <Heading as="h3" size="lg" noOfLines={1}>
            Worked Hours
          </Heading>
          <Heading as="h2" size="md">
            Total: {visibleHours}
          </Heading>
        </Flex>
        <Button
          alignSelf={{ sm: "center" }}
          mb={{ xl: 5, lg: 5 }}
          leftIcon={<FiPlus />}
          colorScheme="teal"
          variant="solid"
          onClick={handleOpenEditWorkHour}
        >
          Add
        </Button>
      </Flex>
      <Stack alignItems={"center"}>
        <WorkCalendar />
      </Stack>
      {isOpen && <ModalEdit onClose={handleCloseModal} isOpen={isOpen} />}
    </Box>
  );
};

export default WorkedHours;
