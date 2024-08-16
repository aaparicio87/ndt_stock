
import { Box, Button, Container, Divider, Stack } from "@chakra-ui/react"
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
        <Box borderWidth='1px' borderRadius='lg' overflow='hidden' padding={10} m={10}>
            <HeaderViewTable
                name="Users"
            >
                <Stack direction='row'
                    spacing={4}
                    flex={1}
                    justifyContent={'flex-end'}
                    marginX={5}
                >
                    <FilterElements />
                    <Button
                        leftIcon={<FiPlus />}
                        colorScheme='teal'
                        variant='solid'
                        onClick={onOpen}
                        px={6}
                    >
                        Add
                    </Button>
                </Stack>
            </HeaderViewTable>

            <Stack alignItems={'center'}>
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
            </Stack>
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
        </Box>
    )
}

export default UsersMain