import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { CustomDataTable } from "../../../components"
import { Button, Heading, Stack, useDisclosure } from "@chakra-ui/react"
import { FiPlus } from "react-icons/fi"
import ModalAdd from "./components/ModalAdd/ModalAdd"
import { getAllStcokElements } from "../../../services"
import { collection, onSnapshot } from "firebase/firestore"
import { FB_DB } from "../../../config/firebase.conf"
import { STOCK } from "../../../utils/constants"


export const Stock = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()

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
            />
        </>
    )
}