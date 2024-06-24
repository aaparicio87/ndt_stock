import React from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { FB_DB } from "../../../../config/firebase.conf"
import { WORKS } from "../../../../utils/constants"
import { deleteWorkElement, getAllWorks } from "../../../../services"
import { useNavigate } from "react-router-dom"
import { useDisclosure } from "@chakra-ui/react"
import { useNotification } from "../../../../hooks/useNotification"


export const useWorks = () => {
    const navigate = useNavigate()
    const { openToast } = useNotification()
    const [isLoading, setIsLoading] = React.useState(false)
    const [data, setData] = React.useState<TWork[]>([])
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [workElementDelete, setWorkElementDelete] = React.useState<TWork | undefined>(undefined)

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(FB_DB, WORKS), (_) => {
            getAllElements()
        })
        return () => unsubscribe();
    }, [])

    const getAllElements = async () => {
        setIsLoading(true)
        try{
            const workData = await getAllWorks();
            if (workData) {
                setData(workData)
            }
        }catch (error) {
            console.error(error)
        }finally{
            setIsLoading(false)
        }
    }

    const handleViewDetails = (item: TWork) => {
        return item
    }

    const handleDelete = (item: TWork) => {
        setWorkElementDelete(item)
        onOpenDelete()
    }

    const handleConfirmDelete = async () => {
        try {
            if (workElementDelete?.uid)
                await deleteWorkElement(workElementDelete.uid)
            onCloseDelete()
            openToast('success', "Element deleted successfully", 'Success')
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
    }

    const openAddWork = () => navigate('create')
    const openEditWork = async (item: TWork) => navigate(`edit/${item.uid}`)

    return {
        isLoading,
        data,
        handleViewDetails,
        openEditWork,
        handleDelete,
        openAddWork,
        isOpenDelete,
        onCloseDelete,
        handleConfirmDelete,
    }
}