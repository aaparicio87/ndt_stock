import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import {
    ActionsTable,
    CustomDataTable,
    Loader
} from "../../../../../components"

type TStaffTable = {
    fullName: string
    email: string
    degree: string
    roles: string
    uid?: string
}

type TProps = {
    data: TStaffTable[]
    onDelete: (uuid: string | undefined) => void
    onDetails: (uuid: string | undefined) => void
    onEdit: (uuid: string | undefined) => void
    currentUser: TStaff | undefined
    loading: boolean
}

const UsersTable = ({
    data,
    onDelete,
    onDetails,
    onEdit,
    currentUser,
    loading
}: TProps) => {

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
            {
                header: 'Actions',
                cell: (props) => (
                    <ActionsTable
                        onDelete={() => onDelete(props.row.original.uid)}
                        onDetails={() => onDetails(props.row.original.uid)}
                        onEdit={() => onEdit(props.row.original.uid)}
                        iconDetailsProps={{ "mr": 2 }}
                        iconEditProps={{ "mr": 2 }}
                        iconDeleteProps={{ "isDisabled": currentUser?.uid === props.row.original.uid }}
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
            loading={loading}
        />
    )
}

export default UsersTable