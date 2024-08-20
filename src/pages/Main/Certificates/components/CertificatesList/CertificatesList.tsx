import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { ActionsTable, CustomDataTable } from '../../../../../components'
import { useCertificatesContext } from '../../../../../context/CertificatesContext'



const CertificatesList = () => {

    const {
        data,
        isLoading,
        handleDelete,
        handleEdit,
    } = useCertificatesContext()

    const columns = React.useMemo<ColumnDef<TCertificates>[]>(
        () => [
            {
                accessorKey: 'name',
                header: () => 'Name',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'description',
                header: () => 'Description',
                footer: props => props.column.id,
            },
            {
                header: 'Actions',
                cell: (props) => (
                    <ActionsTable
                        onDelete={() => handleDelete(props.row.original)}
                        onEdit={() => handleEdit(props.row.original)}
                        iconEditProps={{ "mr": 2 }}
                        iconDeleteProps={{ "mr": 2 }}
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

export default CertificatesList