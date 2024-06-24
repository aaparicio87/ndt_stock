import { DeleteDialog, HeaderViewTable } from "../../../components"
import { Button, Stack } from "@chakra-ui/react"
import { FiPlus } from "react-icons/fi"
import ModalAdd from "./components/ModalAdd/ModalAdd"
import DetailModal from "./components/DetailModal/DetailModal"
import FilterElements from "./components/FilterElements/FilterElements"
import UsersTable from "./components/UsersTable/UsersTable"
import { useUser } from "./hooks/useUsers"


export const Users = () => {

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
    } = useUser()

    return (
        <>
            <HeaderViewTable
                name="Users"
            >
                <Stack direction='row'
                    spacing={4}
                    flex={1}
                    justifyContent={'space-between'}
                    marginBottom={5}
                    marginX={5}
                >
                    <FilterElements />
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
                loading={isLoading}
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
