import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import {
    ActionsTable,
    CustomDataTable,
    DeleteDialog,
    HeaderViewTable,
    MenuFilter
} from '../../../../../components'
import { IWorkTable } from '../../hooks/useWorks'
import { Box, Button, HStack, Stack } from '@chakra-ui/react'
import { FiPlus } from 'react-icons/fi'
import { collection, onSnapshot } from "firebase/firestore";
import { FB_DB } from "../../../../../config/firebase.conf.ts";
import { WORKS } from "../../../../../utils/constants.ts";
import { useWorkContext } from "../../../../../context/WorkContext.tsx";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../../state/features/auth/authSlice.tsx";
import DateRangeFilter from '../../../../../components/DateRangeFilter/DateRangeFilter.tsx'


const WorksTable = () => {

    const {
        openAddWork,
        isLoading,
        data,
        handleDelete,
        openEditWork,
        isOpenDelete,
        onCloseDelete,
        handleConfirmDelete,
        openViewDetail,
        getAllElements,
        errorsFilter,
        registerFilter,
        isSubmittingFilter,
        handleFilterWorks,
        isSubmitSuccessfulFilter,
        handleResetFilter,
        resetFilter
    } = useWorkContext()

    const user = useSelector(selectCurrentUser);

    if (!user) {
        return null
    }

    const currentUserAdminManager = user.roles.some((rol) => rol === 'ADMINISTRATOR' || rol === 'DATA_MANAGER')

    const columns = React.useMemo<ColumnDef<IWorkTable>[]>(
        () => [
            {
                accessorKey: 'reportNumber',
                header: 'Report number',
                footer: props => props.column.id,
            },

            {
                accessorKey: 'customerName',
                header: () => <span>Customer</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'startDate',
                header: 'Start Date',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'endDate',
                header: 'End Date',
                footer: props => props.column.id,
            },
            {
                header: 'Actions',
                cell: (props) => (
                    <ActionsTable
                        onDelete={() => props.row.original.uid && handleDelete(props.row.original.uid)}
                        onDetails={() => props.row.original.uid && openViewDetail(props.row.original.uid)}
                        onEdit={() => props.row.original.uid && openEditWork(props.row.original.uid)}
                        iconEditProps={{ "mr": 2 }}
                        iconDetailsProps={{ "mr": 2 }}
                    />
                )

            },
        ],
        []
    )

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(FB_DB, WORKS), async (_) => {
            await getAllElements()
        })
        return () => unsubscribe();
    }, [])

    return (
        <Box borderWidth='1px' borderRadius='lg' overflow='hidden' padding={10} m={10}>
            <HeaderViewTable
                name="Works"
            >
                <Stack direction='row'
                    spacing={4}
                    flex={1}
                    justifyContent={'flex-end'}
                    marginX={5}
                >
                    <MenuFilter
                        name="Filters"
                        titleGroup="Filter by:"
                        onClose={() => resetFilter()}
                    >
                        <DateRangeFilter
                            endDateErrorCustom={errorsFilter.endDate?.message}
                            startDateErrorCustom={errorsFilter.startDate?.message}
                            onFilter={handleFilterWorks}
                            register={registerFilter}
                            isSubmitting={isSubmittingFilter}
                            displayReset={isSubmitSuccessfulFilter}
                            onReset={handleResetFilter}
                        />
                    </MenuFilter>

                    {currentUserAdminManager && <Button
                        leftIcon={<FiPlus />}
                        colorScheme='teal'
                        variant='solid'
                        onClick={openAddWork}
                    >
                        Add
                    </Button>
                    }
                </Stack>
            </HeaderViewTable>
            <Stack alignItems={'center'}>
                <CustomDataTable
                    columns={columns}
                    data={data}
                    loading={isLoading}
                />
            </Stack>
            <DeleteDialog
                isOpen={isOpenDelete}
                onCancel={onCloseDelete}
                onDelete={handleConfirmDelete}
            />
        </Box>
    )
}

export default WorksTable
