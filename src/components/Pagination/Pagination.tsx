import {
    Box,
    Button,
    Flex,
    Select,
    Text,
    NumberInput,
    NumberInputField,
} from '@chakra-ui/react';
import { Table } from '@tanstack/react-table';

interface PaginationProps<T> {
    table: Table<T>;
}

const Pagination = <T,>({ table }: PaginationProps<T>) => {
    return (
        <Box>
            <Box h="2" />
            <Flex align="center" gap="2">
                <Button
                    onClick={() => table.firstPage()}
                    isDisabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </Button>
                <Button
                    onClick={() => table.previousPage()}
                    isDisabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </Button>
                <Button
                    onClick={() => table.nextPage()}
                    isDisabled={!table.getCanNextPage()}
                >
                    {'>'}
                </Button>
                <Button
                    onClick={() => table.lastPage()}
                    isDisabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </Button>
                <Flex align="center" gap="1">
                    <Text>Page</Text>
                    <Text fontWeight="bold">
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount().toLocaleString()}
                    </Text>
                </Flex>
                <Flex align="center" gap="1">
                    <Text>| Go to page:</Text>
                    <NumberInput
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        min={1}
                        max={table.getPageCount()}
                        onChange={(_, valueAsNumber) => {
                            const page = valueAsNumber ? valueAsNumber - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        width="16"
                    >
                        <NumberInputField />
                    </NumberInput>
                </Flex>
                <Select
                    value={table.getState().pagination.pageSize}
                    onChange={e => table.setPageSize(Number(e.target.value))}
                    width="auto"
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </Select>
            </Flex>
        </Box>
    );
};

export default Pagination;