import React from "react"
import { useDisclosure } from "@chakra-ui/react"
import { useNotification } from "../../../../hooks/useNotification"
import { collection, onSnapshot } from "firebase/firestore"
import { FB_DB } from "../../../../config/firebase.conf"
import { STOCK } from "../../../../utils/constants"
import { deleteStockElement, getAllStcokElements } from "../../../../services"


export const useStock = () => {

    const { openToast } = useNotification()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [stockElement, setStockElement] = React.useState<TStock | undefined>(undefined)
    const [stockElementDelete, setStockElementDelete] = React.useState<TStock | undefined>(undefined)


    const [data, setData] = React.useState<TStock[]>([])

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(FB_DB, STOCK), (_) => {
            getAllElements()
        })
        return () => unsubscribe();
    }, [])

    const getAllElements = async () => {
        try {
            const stockData = await getAllStcokElements();
            if (stockData) {
                setData(stockData)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleViewDetails = (item: TStock) => {
        setStockElement(item)
        onOpenDetail()
    }
    const handleEdit = async (item: TStock) => {
        setStockElement(item)
        onOpen()
    }

    const handleDelete = (item: TStock) => {
        setStockElementDelete(item)
        onOpenDelete()
    }

    const handleConfirmDelete = async () => {
        try {
            if (stockElementDelete?.uid)
                await deleteStockElement(stockElementDelete.uid)
            onCloseDelete()
            openToast('success', "Element deleted successfully", 'Success')
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
    }

    return {
        handleViewDetails,
        handleEdit,
        handleDelete,
        handleConfirmDelete,
        isOpen,
        onClose,
        isOpenDetail,
        onCloseDetail,
        isOpenDelete,
        stockElement,
        data,
        onOpen,
        onCloseDelete
    }
}