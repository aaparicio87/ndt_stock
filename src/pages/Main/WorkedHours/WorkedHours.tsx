import React from "react";
import WorkCalendar from "./components/WorkCalendar/WorkCalendar.tsx";
import {HeaderViewTable} from "../../../components";
import {Button} from "@chakra-ui/react";
import {FiPlus} from "react-icons/fi";
import ModalEdit from "./components/ModalEdit/ModalEdit.tsx";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../../state/features/auth/authSlice.tsx";
import {getWorkHours} from "../../../services";
import {useWorkedHoursContext} from "../../../context/WorkedHoursContext.tsx";


const WorkedHours = () => {

    const {onOpen, isOpen, onClose} = useWorkedHoursContext()
    const user = useSelector(selectCurrentUser);
    const [userWorkHours, setUserWorkHours] = React.useState<TWorkHour[]| undefined>(undefined)

    React.useEffect(()=>{
        if(user){
            if(user.uid)
            getWorkHours(user.uid).then((response) => setUserWorkHours(response))
        }
    },[user])

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
            <WorkCalendar wHours={userWorkHours}/>
            { isOpen && <ModalEdit
                onClose={onClose}
                isOpen={isOpen}
            />}
        </>
    )
}

export default WorkedHours
