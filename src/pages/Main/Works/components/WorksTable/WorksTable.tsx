import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { ActionsTable, CustomDataTable } from '../../../../../components'

type TProps = {
    data: TWork[]
    onDelete: (item: TWork) => void
    onDetails: (item: TWork) => void
    onEdit: (item: TWork) => void
}

const WorksTable = ({
    data,
    onDelete,
    onDetails,
    onEdit
}: TProps) => {

    const columns = React.useMemo<ColumnDef<TWork>[]>(
        () => [
            {
                accessorKey: 'reportNumber',
                header: 'Report number',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'name',
                header: () => 'Name',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'customer',
                header: () => <span>Customer</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'expiredDate',
                header: 'Expired Date',
                footer: props => props.column.id,
            },
            {
                header: 'Actions',
                cell: (props) => (
                    <ActionsTable
                        onDelete={() => onDelete(props.row.original)}
                        onDetails={() => onDetails(props.row.original)}
                        onEdit={() => onEdit(props.row.original)}
                    />
                )

            },
        ],
        []
    )

    return (
        <CustomDataTable
            columns={columns}
            data={data}
        />
    )
}

export default WorksTable