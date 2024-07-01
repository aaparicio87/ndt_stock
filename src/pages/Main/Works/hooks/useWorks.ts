import React from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { FB_DB } from "../../../../config/firebase.conf"
import { WORKS } from "../../../../utils/constants"
import { 
    deleteWorkElement, 
    getAllCustomers, 
    getAllStaff, 
    getAllWorks, 
    getAllCertificates, 
} from "../../../../services"
import { useNavigate } from "react-router-dom"
import { useDisclosure } from "@chakra-ui/react"
import { useNotification } from "../../../../hooks/useNotification"


interface IOption {
    label: string, 
    value: string 
}

export const useWorks = () => {
    const navigate = useNavigate()
    const { openToast } = useNotification()
    const [isLoading, setIsLoading] = React.useState(false)
    const [data, setData] = React.useState<TWork[]>([])
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [workElementDelete, setWorkElementDelete] = React.useState<TWork | undefined>(undefined)
    const [workersList, setWorkersList] = React.useState<IOption[]>([])
    const [certificatesList, setCertificatesList] = React.useState<IOption[]>([])
    const [customersList, setCustomersList] = React.useState<IOption[]>([])
    const workersRemote = React.useRef<TStaff[]>([])
    const customersRemote = React.useRef<TCustomer[]>([])
    const certificatesRemote = React.useRef<TCertificates[]>([])
    
    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(FB_DB, WORKS), async(_) => {
            await getAllElements()
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

    const handleGetAllStaff = async() => {
        try {
          const allStaff =  await getAllStaff()
          if (!allStaff) {
            console.error("No response from getAllStaff")
            return
        }
        workersRemote.current = allStaff
        const listWorkers = allStaff
            .filter((res) => res.roles.some((role) => role === 'USER'))
            .map((res) => ({
                label: `${res.name} ${res.lastName}`,
                value: `${res.uid}`
            }));
        setWorkersList(listWorkers)
        } catch (error) {
            console.error("Error fetching staff: ", error)
        }
    }

    const handleGetAllCustomers = async() => {
        try {
            const customers = await getAllCustomers()
            if(customers){
                customersRemote.current = customers
                const list = customers
                    .map((res) => ({
                        label: res.name,
                        value: res.uid
                    }));
                setCustomersList(list)
            }
        } catch (error) {
            console.error("Error fetching staff: ", error)
        }
    }

    const handleGetAllCertificates = async() => {
        try {
            const certificates = await getAllCertificates()
            if(certificates){
                certificatesRemote.current = certificates
                const list = certificates
                    .map((res) => ({
                        label: res.name,
                        value: res.uid
                    }));
                setCertificatesList(list)
            }
        } catch (error) {
            console.error("Error fetching staff: ", error)
        }
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
    const openWorksTable = () => navigate('/works')
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
        workersRemote,
        workersList,
        customersRemote,
        certificatesRemote,
        handleGetAllStaff,
        handleGetAllCustomers,
        handleGetAllCertificates,
        certificatesList,
        customersList,
        openWorksTable
    }
}