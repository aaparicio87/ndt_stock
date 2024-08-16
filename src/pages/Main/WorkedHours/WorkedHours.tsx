import WorkCalendar from "./components/WorkCalendar/WorkCalendar.tsx";
import { HeaderViewTable } from "../../../components";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import ModalEdit from "./components/ModalEdit/ModalEdit.tsx";
import { useWorkedHoursContext } from "../../../context/WorkedHoursContext.tsx";


const WorkedHours = () => {

    const {
        onOpen,
        isOpen,
        handleCloseModal,
        visibleHours
    } = useWorkedHoursContext()

    return (
        <Box overflow='hidden' m={10} padding={10} >
            <HeaderViewTable
                name="Worked Hours"
            >
                <Heading as="h2" size="md" mb={4}>
                    Total: {visibleHours}
                </Heading>
                <Button
                    leftIcon={<FiPlus />}
                    colorScheme='teal'
                    variant='solid'
                    onClick={onOpen}
                >
                    Add
                </Button>
            </HeaderViewTable>
            <Stack alignItems={'center'}>
                <WorkCalendar />
            </Stack>
            {isOpen && <ModalEdit
                onClose={handleCloseModal}
                isOpen={isOpen}
            />}
        </Box>
    )
}

export default WorkedHours
