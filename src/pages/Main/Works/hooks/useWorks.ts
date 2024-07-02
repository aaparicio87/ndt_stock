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
    getWorkByUID
} from "../../../../services"
import { useNavigate } from "react-router-dom"
import { useDisclosure } from "@chakra-ui/react"
import { useNotification } from "../../../../hooks/useNotification"


interface IOption {
    label: string, 
    value: string 
}

export interface IWorkTable {
    uid?:string
    customerName:string
    startDate:string
    endDate:string
    reportNumber:string
}

export interface IDetailWork {
    name: string,
    workers:string,
    customer: string,
    startDate: string,
    endDate: string,
    description: string,
    reportNumber: string,
    reportPlace: string,
    address: string,
    invoiceNumber: string,
    films: number,
    cans: number,
    needToDeliver: string,
}

export const useWorks = () => {
    const navigate = useNavigate()
    const { openToast } = useNotification()
    const [isLoading, setIsLoading] = React.useState(false)
    const [data, setData] = React.useState<IWorkTable[]>([])
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [workersList, setWorkersList] = React.useState<IOption[]>([])
    const [certificatesList, setCertificatesList] = React.useState<IOption[]>([])
    const [customersList, setCustomersList] = React.useState<IOption[]>([])
    const [workElementDelete, setWorkElementDelete] = React.useState<TWork | undefined>(undefined)
    const [workElementDetailt, setWorkElementDetailt] = React.useState<IDetailWork | undefined>(undefined)
    const workersRemote = React.useRef<TStaff[]>([])
    const customersRemote = React.useRef<TCustomer[]>([])
    const certificatesRemote = React.useRef<TCertificates[]>([])
    const worksRemoteRef = React.useRef<TWork[]>([])
    
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
                worksRemoteRef.current = workData
                const dataTable = workData.map((wd) => {
                    const wsTable:IWorkTable = {
                        endDate: wd.endDate,
                        startDate: wd.startDate,
                        customerName: wd.customer?.name ?? '-',
                        reportNumber: wd.reportNumber,
                        uid: wd.uid 
                    }
                    return wsTable
            })
                setData(dataTable)
            }
        }catch (error) {
            console.error(error)
        }finally{
            setIsLoading(false)
        }
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
            openToast('error', JSON.stringify(error), "Error")
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
            openToast('error', JSON.stringify(error), "Error")
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
            openToast('error', JSON.stringify(error), "Error")
        }
    }

    const handleDelete = (uid:string) => {
        const work = worksRemoteRef.current.find((wr) => wr.uid === uid)
        setWorkElementDelete(work)
        onOpenDelete()
        console.log('handleDelete End')
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

    const handleGetElementDetail = async(uid:string) => {
        setIsLoading(true)
        try {
          const work =  await getWorkByUID(uid)
          if(work !== null){
            console.log(work)
            const detailWork:IDetailWork = {
                name: work.typeWork.map((tw) => tw.name).join(", "),
                address: work.address ? work.address.length > 0 ? work.address : '-': '-',
                cans: work.cans ?? 0,
                customer: work.customer?.name ?? '-',
                description: work.description ? work.description.length > 0 ? work.description : '-' : '-',
                startDate: work.startDate,
                endDate: work.endDate,
                films: work.films ?? 0,
                invoiceNumber: work.invoiceNumber,
                needToDeliver: work.needToDeliver ? "Yes" : "No",
                reportNumber: work.reportNumber,
                reportPlace: work.reportPlace ?? '-',
                workers: work.workers.map((ws) => `${ws.name} ${ws.lastName}`).join(', ')
            }
            setWorkElementDetailt(detailWork)
          }
        } catch (error) {
            console.error(error)
            openToast('error', JSON.stringify(error), "Error")
        }finally{
            setIsLoading(false)
        }
    }

    const openAddWork = () => navigate('create')
    const openWorksTable = () => navigate('/works')
    const openEditWork = (uid: string) => navigate(`edit/${uid}`)
    const openViewDetail = (uid: string) => navigate(`detail/${uid}`)

    return {
        isLoading,
        data,
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
        openWorksTable,
        openViewDetail,
        handleGetElementDetail,
        workElementDetailt
    }
}