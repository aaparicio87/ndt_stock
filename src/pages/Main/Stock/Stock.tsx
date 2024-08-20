import { DeleteDialog } from "../../../components"
import { Box, Stack } from "@chakra-ui/react"
import ModalAdd from "./components/ModalAdd/ModalAdd"
import DetailModal from "./components/DetailModal/DetailModal"
import StockTable from "./components/StockTable/StockTable"
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../state/features/auth/authSlice.tsx";
import HeaderTable from "./components/HeaderTable/HeaderTable.tsx"
import { useStockContext } from "../../../context/StockContext.tsx"


export const Stock = () => {

    const {
        stockElement,
        isOpenDelete,
        handleCancelDelete,
        handleConfirmDelete,
    } = useStockContext()

    const user = useSelector(selectCurrentUser) as TStaff

    if (!user) {
        return null
    }

    const isAdminManager = user.roles.some((rol) => rol === 'ADMINISTRATOR' || rol === 'DATA_MANAGER')

    return (
        <Box
            borderWidth='1px'
            borderRadius='lg'
            overflow='hidden'
            padding={10}
            m={10}
        >
            <HeaderTable isAdminManager={isAdminManager} />
            <Stack alignItems={'center'}>
                <StockTable />
            </Stack>
            <ModalAdd />
            {stockElement && <DetailModal />}
            <DeleteDialog
                isOpen={isOpenDelete}
                onCancel={handleCancelDelete}
                onDelete={handleConfirmDelete}
            />
        </Box>
    )
}
