import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { ActionsTable, CustomDataTable } from "../../../../../components"
import { useStockContext } from "../../../../../context/StockContext"



const StockTable = () => {

    const {
        data,
        handleDelete,
        handleViewDetails,
        handleEdit,
        isLoading
    } = useStockContext()

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
                header: 'Actions',
                cell: (props) => (
                    <ActionsTable
                        onDelete={() => handleDelete(props.row.original)}
                        onDetails={() => handleViewDetails(props.row.original)}
                        onEdit={() => handleEdit(props.row.original)}
                        iconEditProps={{ "mr": 2 }}
                        iconDetailsProps={{ "mr": 2 }}
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
            loading={isLoading}
        />
    )
}

export default StockTable
