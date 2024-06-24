import {
    Center,
    Icon,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    useReactTable
} from "@tanstack/react-table"
import React from "react"
import { FiInbox } from "react-icons/fi"
import { Loader } from "../Loader/Loader"

type TProps<T> = {
    data: T[]
    columns: ColumnDef<T>[]
    loading: boolean
}

export const CustomDataTable = <T extends object>({ data, columns, loading }: TProps<T>) => {

    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const table = useReactTable({
        columns,
        data,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,

        state: {
            pagination,
        },
    })

    return (
        <TableContainer>
            {loading
                ? <Loader />
                : <Table variant='simple'>
                    <Thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <Th key={header.id} colSpan={header.colSpan}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </Th>
                                    )
                                })}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody>
                        {table.getRowModel().rows.length === 0 &&
                            <Tr>
                                <Td colSpan={columns.length}>
                                    <Center py={10}>
                                        <Icon as={FiInbox} w={10} h={10} mr={2} />
                                        No data available
                                    </Center>
                                </Td>
                            </Tr>
                        }
                        {table.getRowModel().rows.map(row => {
                            return (
                                <Tr
                                    key={row.id}
                                    textAlign={'center'}
                                >
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <Td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Td>
                                        )
                                    })}
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>}
        </TableContainer>
    )
}
