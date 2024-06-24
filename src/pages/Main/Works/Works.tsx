import React from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { ActionsTable, HeaderViewTable } from '../../../components'
import WorksTable from './components/WorksTable/WorksTable'


const Works = () => {

    const [data, setData] = React.useState<TWork[]>([])

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
                        onDelete={() => handleDelete(props.row.original)}
                        onDetails={() => handleViewDetails(props.row.original)}
                        onEdit={() => handleEdit(props.row.original)}
                    />
                )

            },
        ],
        []
    )

    const handleViewDetails = (item: TWork) => {

    }
    const handleEdit = async (item: TWork) => {

    }

    const handleDelete = (item: TWork) => {

    }

    return (
        <>
            <HeaderViewTable
                name="Works"
            />
            <WorksTable
                data={data}
                onDelete={handleDelete}
                onDetails={handleViewDetails}
                onEdit={handleEdit}
            />
        </>
    )
}

export default Works