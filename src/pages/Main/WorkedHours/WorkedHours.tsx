import WorkCalendar from "./components/WorkCalendar/WorkCalendar.tsx";
import { HeaderViewTable } from "../../../components";
import { Button } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import ModalEdit from "./components/ModalEdit/ModalEdit.tsx";
import { useWorkedHoursContext } from "../../../context/WorkedHoursContext.tsx";


const WorkedHours = () => {

    const { onOpen, isOpen, onClose } = useWorkedHoursContext()

    return (
        <>
            <HeaderViewTable
                name="Worked Hours"
            >
                <Button
                    leftIcon={<FiPlus />}
                    colorScheme='teal'
                    variant='solid'
                    onClick={onOpen}
                >
                    Add
                </Button>
            </HeaderViewTable>
            <WorkCalendar />
            {isOpen && <ModalEdit
                onClose={onClose}
                isOpen={isOpen}
            />}
        </>
    )
}

export default WorkedHours
