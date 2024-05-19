import {
    Card,
    CardBody,
} from "@chakra-ui/react"
import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { CustomDataTable } from "../../../components"
import { TStock } from "../../../utils"


const Stock = () => {
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

    return (
        <CustomDataTable
            columns={columns}
            data={data}
        />
    )
}

export default Stock