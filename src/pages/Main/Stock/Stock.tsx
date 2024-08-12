import {
    DeleteDialog,
    HeaderViewTable
} from "../../../components"
import {
    Button,
} from "@chakra-ui/react"
import { FiPlus } from "react-icons/fi"
import ModalAdd from "./components/ModalAdd/ModalAdd"
import DetailModal from "./components/DetailModal/DetailModal"
import StockTable from "./components/StockTable/StockTable"
import { useStock } from "./hooks/useStock"
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../state/features/auth/authSlice.tsx";


export const Stock = () => {

    const {
        data,
        handleConfirmDelete,
        handleDelete,
        handleEdit,
        handleViewDetails,
        isOpen,
        isOpenDelete,
        isOpenDetail,
        onClose,
        onCloseDetail,
        stockElement,
        onOpen,
        onCloseDelete,
        isLoading
    } = useStock()

    const user = useSelector(selectCurrentUser) as TStaff

    if (!user) {
        return null
    }

    const currentUserAdminManager = user.roles.some((rol) => rol === 'ADMINISTRATOR' || rol === 'DATA_MANAGER')

    return (
        <>
            <HeaderViewTable
                name="Stock"
            >
                {currentUserAdminManager && <Button
                    leftIcon={<FiPlus />}
                    colorScheme='teal'
                    variant='solid'
                    onClick={onOpen}
                >
                    Add
                </Button>}
            </HeaderViewTable>
            <StockTable
                data={data}
                onDelete={handleDelete}
                onDetails={handleViewDetails}
                onEdit={handleEdit}
                isLoading={isLoading}
            />
            <ModalAdd
                isOpen={isOpen}
                onClose={onClose}
                item={stockElement}
            />

            {stockElement && <DetailModal
                isOpen={isOpenDetail}
                onClose={onCloseDetail}
                item={stockElement}
            />}

            <DeleteDialog
                isOpen={isOpenDelete}
                onCancel={onCloseDelete}
                onDelete={handleConfirmDelete}
            />
        </>
    )
}
