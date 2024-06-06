import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { CustomDataTable, DeleteDialog } from "../../../components"
import {
    Box,
    Button,
    Heading,
    IconButton,
    Stack,
    Tooltip,
    useDisclosure
} from "@chakra-ui/react"
import { FiPlus, FiEye, FiEdit, FiTrash2 } from "react-icons/fi"
import ModalAdd from "./components/ModalAdd/ModalAdd"
import { deleteStockElement, getAllStcokElements } from "../../../services"
import { collection, onSnapshot } from "firebase/firestore"
import { FB_DB } from "../../../config/firebase.conf"
import { STOCK } from "../../../utils/constants"
import DetailModal from "./components/DetailModal/DetailModal"
import { useNotification } from "../../../hooks/useNotification"


export const Stock = () => {

    const { openToast } = useNotification()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [stockElement, setStockElement] = React.useState<TStock | undefined>(undefined)
    const [stockElementDelete, setStockElementDelete] = React.useState<TStock | undefined>(undefined)

    const columns = React.useMemo<ColumnDef<TStock>[]>(
        () => [
            {
                accessorKey: 'typeEquipment',
                header: () => 'Type of Equipment',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'tradeMark',
                header: () => <span>Trademark</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'model',
                header: 'Model',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'serialNumber',
                header: 'Serial Number',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'store',
                header: 'Store',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'calibrationDate',
                header: 'Calibration',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'qualityOfService',
                header: 'QoS',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'remarks',
                header: 'Remarks',
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
                                onClick={() => handleViewDetails(props.row.original)}
                                mr={2}
                            />
                        </Tooltip>
                        <Tooltip label="Update" aria-label="Update">
                            <IconButton
                                icon={<FiEdit />}
                                aria-label="Update"
                                onClick={() => handleEdit(props.row.original)}
                            />
                        </Tooltip>
                        <Tooltip label="Delete" aria-label="Update">
                            <IconButton
                                icon={<FiTrash2 />}
                                aria-label="Delete"
                                onClick={() => handleDelete(props.row.original)}
                            />
                        </Tooltip>
                    </Box>
                )

            },
        ],
        []
    )

    const [data, setData] = React.useState<TStock[]>([])

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(FB_DB, STOCK), (_) => {
            getAllElements()
        })
        return () => unsubscribe();
    }, [])

    const getAllElements = async () => {
        try {
            const stockData = await getAllStcokElements();
            if (stockData) {
                setData(stockData)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleViewDetails = (item: TStock) => {
        setStockElement(item)
        onOpenDetail()
    }
    const handleEdit = async (item: TStock) => {
        setStockElement(item)
        onOpen()
    }

    const handleDelete = (item: TStock) => {
        setStockElementDelete(item)
        onOpenDelete()
    }

    const handleConfirmDelete = async () => {
        try {
            if (stockElementDelete?.uid)
                await deleteStockElement(stockElementDelete.uid)
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
                <Heading
                    as='h3'
                    size='lg'
                    noOfLines={1}
                >
                    Stock
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
            <ModalAdd
                isOpen={isOpen}
                onClose={onClose}
                item={stockElement}
            />

            {stockElement && <DetailModal
                isOpen={isOpenDetail}
                onClose={onCloseDetail}
                item={stockElement}
            />}

            <DeleteDialog
                isOpen={isOpenDelete}
                onCancel={onCloseDelete}
                onDelete={handleConfirmDelete}
            />
        </>
    )
}