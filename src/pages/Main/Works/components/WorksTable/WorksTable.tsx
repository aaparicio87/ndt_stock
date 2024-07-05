import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ActionsTable, CustomDataTable, DeleteDialog, HeaderViewTable } from '../../../../../components'
import { IWorkTable } from '../../hooks/useWorks'
import { Button } from '@chakra-ui/react'
import { FiPlus } from 'react-icons/fi'
import {collection, onSnapshot} from "firebase/firestore";
import {FB_DB} from "../../../../../config/firebase.conf.ts";
import {WORKS} from "../../../../../utils/constants.ts";
import {useWorkContext} from "../../../../../context/WorkContext.tsx";


const WorksTable = () => {

    const {
        openAddWork,
        isLoading,
        data,
        handleDelete,
        openEditWork,
        isOpenDelete,
        onCloseDelete,
        handleConfirmDelete,
        openViewDetail,
        getAllElements
    } = useWorkContext()

    const columns = React.useMemo<ColumnDef<IWorkTable>[]>(
        () => [
            {
                accessorKey: 'reportNumber',
                header: 'Report number',
                footer: props => props.column.id,
            },

            {
                accessorKey: 'customerName',
                header: () => <span>Customer</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'startDate',
                header: 'Start Date',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'endDate',
                header: 'End Date',
                footer: props => props.column.id,
            },
            {
                header: 'Actions',
                cell: (props) => (
                    <ActionsTable
                        onDelete={() => props.row.original.uid && handleDelete(props.row.original.uid)}
                        onDetails={() => props.row.original.uid && openViewDetail(props.row.original.uid)}
                        onEdit={() => props.row.original.uid && openEditWork(props.row.original.uid)}
                        iconEditProps={{ "mr": 2 }}
                        iconDetailsProps={{ "mr": 2 }}
                    />
                )

            },
        ],
        []
    )

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(FB_DB, WORKS), async(_) => {
            await getAllElements()
        })
        return () => unsubscribe();
    }, [])

    return (
        <>
            <HeaderViewTable
                name="Works"
            >
                <Button
                    leftIcon={<FiPlus />}
                    colorScheme='teal'
                    variant='solid'
                    onClick={openAddWork}
                >
                    Add
                </Button>
            </HeaderViewTable>
            <CustomDataTable
                columns={columns}
                data={data}
                loading={isLoading}
            />
            <DeleteDialog
                isOpen={isOpenDelete}
                onCancel={onCloseDelete}
                onDelete={handleConfirmDelete}
            />
        </>
    )
}

export default WorksTable
