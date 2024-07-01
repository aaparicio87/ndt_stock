import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { ActionsTable, CustomDataTable } from "../../../../../components"

type TProps = {
    data: TStock[]
    onDelete: (item: TStock) => void
    onDetails: (item: TStock) => void
    onEdit: (item: TStock) => void
    isLoading: boolean
}

const StockTable = ({ data, onDelete, onDetails, onEdit, isLoading }: TProps) => {

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
                accessorKey: 'qualityOfService',
                header: 'QoS',
                footer: props => props.column.id,
            },
            {
                header: 'Actions',
                cell: (props) => (
                    <ActionsTable
                        onDelete={() => onDelete(props.row.original)}
                        onDetails={() => onDetails(props.row.original)}
                        onEdit={() => onEdit(props.row.original)}
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