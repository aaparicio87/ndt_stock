import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ActionsTable, CustomDataTable, HeaderViewTable } from '../../../../../components'
import { useWorks } from '../../hooks/useWorks'
import { Button } from '@chakra-ui/react'
import { FiPlus } from 'react-icons/fi'


const WorksTable = () => {

    const {
        openAddWork,
        isLoading,
        data,
        handleDelete,
        openEditWork,
        handleViewDetails,
    } = useWorks()

    const columns = React.useMemo<ColumnDef<TWork>[]>(
        () => [
            {
                accessorKey: 'reportNumber',
                header: 'Report number',
                footer: props => props.column.id,
            },

            {
                accessorKey: 'customer',
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
                        onDelete={() => handleDelete(props.row.original)}
                        onDetails={() => handleViewDetails(props.row.original)}
                        onEdit={() => openEditWork(props.row.original)}
                        iconEditProps={{ "mr": 2 }}
                        iconDetailsProps={{ "mr": 2 }}
                    />
                )

            },
        ],
        []
    )

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
        </>
    )
}

export default WorksTable