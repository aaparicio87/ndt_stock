import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { CustomDataTable } from "../../../components"
import { Button, Heading, Stack, useDisclosure } from "@chakra-ui/react"
import { FiPlus } from "react-icons/fi"
import ModalAdd from "./components/ModalAdd/ModalAdd"

type TStaffTable = {
    fullName: string
    email: string
    degree: string
    roles: string
}



export const Users = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const columns = React.useMemo<ColumnDef<TStaffTable>[]>(
        () => [
            {
                accessorKey: 'fullName',
                header: () => 'Full name',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'email',
                header: () => 'Email',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'degree',
                header: 'Degree',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'roles',
                header: 'Roles',
                footer: props => props.column.id,
            },
        ],
        []
    )

    const [data, setData] = React.useState<TStaffTable[]>([])

    return (
        <>
            <Stack direction='row'
                spacing={4}
                flex={1}
                justifyContent={'space-between'}
                marginBottom={5}
                marginX={5}
            >
                <Heading as='h3' size='lg' noOfLines={1}>
                    Users
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
