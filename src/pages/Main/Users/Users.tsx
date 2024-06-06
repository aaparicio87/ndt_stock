import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { CustomDataTable, DeleteDialog } from "../../../components"
import { Box, Button, Heading, IconButton, Stack, Tooltip, useDisclosure } from "@chakra-ui/react"
import { FiEdit, FiEye, FiPlus, FiTrash2 } from "react-icons/fi"
import ModalAdd from "./components/ModalAdd/ModalAdd"
import { collection, onSnapshot } from "firebase/firestore"
import { FB_DB } from "../../../config/firebase.conf"
import { STAFF } from "../../../utils/constants"
import { deleteStaffElement, getAllStaff, getStaffInformationByUserUID } from "../../../services"
import { useNotification } from "../../../hooks/useNotification"
import DetailModal from "./components/DetailModal/DetailModal"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "../../../state/features/auth/authSlice"

type TStaffTable = {
    fullName: string
    email: string
    degree: string
    roles: string
    uid?: string
}


export const Users = () => {

    const user = useSelector(selectCurrentUser);
    const { openToast } = useNotification()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [staffElement, setStaffElement] = React.useState<TStaff | undefined>(undefined)
    const [staffElementDelete, setStaffElementDelete] = React.useState<string | undefined>(undefined)

    const columns = React.useMemo<ColumnDef<TStaffTable>[]>(
        () => [
            {
                accessorKey: 'fullName',
                header: () => 'Full name',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'email',
                header: () => 'Email',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'degree',
                header: 'Degree',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'roles',
                header: 'Roles',
                footer: props => props.column.id,
            },
            {
                header: 'Actions',
                cell: (props) => (
                    <Box>
                        <Tooltip label="Show details" aria-label="Show details">
                            <IconButton
                                icon={<FiEye />}
                                aria-label="Show details"
                                onClick={() => handleViewDetails(props.row.original.uid)}
                                mr={2}
                            />
                        </Tooltip>
                        <Tooltip label="Update" aria-label="Update">
                            <IconButton
                                icon={<FiEdit />}
                                aria-label="Update"
                                onClick={() => handleEdit(props.row.original.uid)}
                                mr={2}
                            />
                        </Tooltip>

                        <Tooltip label="Delete" aria-label="Update">
                            <IconButton
                                icon={<FiTrash2 />}
                                aria-label="Delete"
                                onClick={() => handleDelete(props.row.original.uid)}
                                isDisabled={user?.uid === props.row.original.uid}
                            />
                        </Tooltip>

                    </Box>
                )

            },
        ],
        []
    )

    const [data, setData] = React.useState<TStaffTable[]>([])

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(FB_DB, STAFF), (_) => {
            getAllElements()
        })
        return () => unsubscribe();
    }, [])

    const getAllElements = async () => {
        try {
            const staffData = await getAllStaff();
            if (staffData) {
                const staffDataTable = staffData.map((staff) => {
                    const staffTableData: TStaffTable = {
                        degree: staff.degree ?? '',
                        email: staff.email,
                        fullName: `${staff.name} ${staff.lastName}`,
                        roles: staff.roles.join(', '),
                        uid: staff.uid
                    }
                    return staffTableData
                })
                setData(staffDataTable)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleViewDetails = async (uid: string | undefined) => {
        try {
            if (uid) {
                const staff = await getStaffInformationByUserUID(uid)
                setStaffElement(staff)
                onOpenDetail()
            }
        } catch (error) {
            console.error(error)
        }
    }
    const handleEdit = async (uid: string | undefined) => {
        if (uid) {
            const staff = await getStaffInformationByUserUID(uid)
            setStaffElement(staff)
            onOpen()
        }
        onOpen()
    }

    const handleDelete = (item: string | undefined) => {
        setStaffElementDelete(item)
        onOpenDelete()
    }

    const handleConfirmDelete = async () => {
        try {
            if (staffElementDelete)
                await deleteStaffElement(staffElementDelete)
            onCloseDelete()
            openToast('success', "Element deleted successfully", 'Success')
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
    }


    return (
        <>
            <Stack direction='row'
                spacing={4}
                flex={1}
                justifyContent={'space-between'}
                marginBottom={5}
                marginX={5}
            >
                <Heading as='h3' size='lg' noOfLines={1}>
                    Users
                </Heading>
                <Button
                    leftIcon={<FiPlus />}
                    colorScheme='teal'
                    variant='solid'
                    onClick={onOpen}
                >
                    Add
                </Button>
            </Stack>
            <CustomDataTable
                columns={columns}
                data={data}
            />
            {isOpen && <ModalAdd
                isOpen={isOpen}
                onClose={onClose}
                item={staffElement}
            />}
            {staffElement && <DetailModal
                isOpen={isOpenDetail}
                onClose={onCloseDetail}
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
