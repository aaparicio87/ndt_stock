
import { Button, Stack } from "@chakra-ui/react"
import { FiPlus } from "react-icons/fi"
import { useLocation } from "react-router-dom"
import { DeleteDialog, HeaderViewTable } from "../../../../../components"
import UsersTable from "../UsersTable/UsersTable"
import ModalAdd from "../ModalAdd/ModalAdd"
import DetailModal from "../DetailModal/DetailModal"
import FilterElements from "../FilterElements/FilterElements"
import { useStaffContext } from "../../../../../context/StaffContext"


const UsersMain = () => {

    let location = useLocation();

    const {
        onOpen,
        closeModalAdd,
        data,
        handleConfirmDelete,
        handleDelete,
        handleEdit,
        handleViewDetails,
        isOpenDelete,
        staffElement,
        user,
        isOpen,
        isOpenDetail,
        onCloseDelete,
        isLoading,
        openWorksUser
    } = useStaffContext()

    return (
        <>
            <HeaderViewTable
                name="Users"
            >
                <Stack direction='row'
                    spacing={4}
                    flex={1}
                    justifyContent={'flex-end'}
                    marginX={5}
                >
                    <Button
                        leftIcon={<FiPlus />}
                        colorScheme='teal'
                        variant='solid'
                        onClick={onOpen}
                    >
                        Add
                    </Button>
                </Stack>
            </HeaderViewTable>
            <Stack me={5} mb={5} >
                <FilterElements />
            </Stack>
            <UsersTable
                currentUser={user}
                data={data}
                onDelete={handleDelete}
                onDetails={handleViewDetails}
                onEdit={handleEdit}
                onHours={openWorksUser}
                loading={isLoading}
                visibleHours={location.pathname === "/users"}
            />
            {isOpen && <ModalAdd
                isOpen={isOpen}
                onClose={closeModalAdd}
                item={staffElement}
            />}
            {staffElement && <DetailModal
                isOpen={isOpenDetail}
                onClose={closeModalAdd}
                item={staffElement}
            />}
            <DeleteDialog
                isOpen={isOpenDelete}
                onCancel={onCloseDelete}
                onDelete={handleConfirmDelete}
            />
        </>
    )
}

export default UsersMain