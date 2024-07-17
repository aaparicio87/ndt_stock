
import { Button, Stack } from "@chakra-ui/react"
import { FiPlus } from "react-icons/fi"
import { useLocation } from "react-router-dom"
import { useUser } from "../../hooks/useUsers"
import FilterElements from "../FilterElements/FilterElements"
import { DeleteDialog, HeaderViewTable } from "../../../../../components"
import UsersTable from "../UsersTable/UsersTable"
import ModalAdd from "../ModalAdd/ModalAdd"
import DetailModal from "../DetailModal/DetailModal"


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
    } = useUser()

    return (
        <>
            <HeaderViewTable
                name="Users"
            >
                <Stack direction='row'
                    spacing={4}
                    flex={1}
                    justifyContent={'flex-end'}
                    marginBottom={5}
                    marginX={5}
                >
                    {/* <FilterElements /> */}
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