import React, {ChangeEvent} from "react"
import {
    deleteWorkElement,
    getAllCustomers,
    getAllStaff,
    getAllWorks,
    getAllCertificates,
    getWorkByUID,
    createNewWorkElement,
    updateWorkElement,
} from "../../../../services"
import {useNavigate, useParams} from "react-router-dom"
import { useDisclosure } from "@chakra-ui/react"
import { useNotification } from "../../../../hooks/useNotification"
import {FieldErrors, useForm, UseFormRegister} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {WORKS_VALIDATION_SCHEMA} from "../../../../utils/validationSchemas.ts";
import {MultiValue} from "react-select";


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

const INITIAL_STATE: Partial<TWork> = {
    typeWork: [],
    workers: [],
    customer: undefined,
    startDate: "",
    endDate: "",
    description: "",
    reportNumber: "",
    reportPlace: "",
    address: "",
    invoiceNumber: "",
    films: 0,
    cans: 0,
    needToDeliver: false,
}

export interface IWorkHook {
    isLoading: boolean,
    data: IWorkTable[],
    openEditWork: (uid: string) => void,
    handleDelete: (id: string) => void,
    openAddWork: () => void,
    isOpenDelete: boolean,
    onCloseDelete: () => void,
    handleConfirmDelete: () => Promise<void>,
    workersList: TOptions[],
    handleGetAllStaff: () => Promise<void>,
    handleGetAllCustomers: () => Promise<void>,
    handleGetAllCertificates: () => Promise<void>,
    certificatesList: TOptions[],
    customersList: TOptions[],
    openWorksTable: () => void,
    openViewDetail: (uid: string) => void,
    handleGetElementDetail: (uid:string) => Promise<void>,
    handleChangeWorkersSelect: (newValue: MultiValue<TOptions>) => void,
    handleChangeCustomersSelect: (event: ChangeEvent<HTMLSelectElement>) => void,
    handleChangeItemCertificates: (newValue: MultiValue<TOptions>) => void,
    workersSelected: MultiValue<TOptions>,
    itemsCertificates: MultiValue<TOptions>,
    customerSelected: string,
    register: UseFormRegister<TWork>,
    errors:FieldErrors<TWork>,
    isSubmitting: boolean,
    handleCancel: () => void,
    handleCreateUpdateWork: (e?: (React.BaseSyntheticEvent<object, any, any> | undefined)) => Promise<void>,
    handleSelectOptions: ()=> Promise<void>,
    getAllElements:()=> Promise<void>,
    workElementDetail: IDetailWork | undefined,
}

export const useWorks = ():IWorkHook => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>();
    const { openToast } = useNotification()
    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isSubmitSuccessful }
    } = useForm<TWork>({
        resolver: zodResolver(WORKS_VALIDATION_SCHEMA)
    });
    const [isLoading, setIsLoading] = React.useState(false)
    const [data, setData] = React.useState<IWorkTable[]>([])
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [workersList, setWorkersList] = React.useState<TOptions[]>([])
    const [certificatesList, setCertificatesList] = React.useState<TOptions[]>([])
    const [customersList, setCustomersList] = React.useState<TOptions[]>([])
    const [workElementDelete, setWorkElementDelete] = React.useState<TWork | undefined>(undefined)
    const [workElementDetail, setWorkElementDetail] = React.useState<IDetailWork | undefined>(undefined)
    const [itemsCertificates, setItemsCertificates] = React.useState<MultiValue<TOptions>>([])
    const [workersSelected, setWorkersSelected] = React.useState<MultiValue<TOptions>>([])
    const [customerSelected, setCustomerSelected] = React.useState("")
    const workersRemote = React.useRef<TStaff[]>([])
    const customersRemote = React.useRef<TCustomer[]>([])
    const certificatesRemote = React.useRef<TCertificates[]>([])
    const worksRemoteRef = React.useRef<TWork[]>([])

    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
            setItemsCertificates([])
            setWorkersSelected([])
            setCustomerSelected("")
        }
    }, [isSubmitSuccessful])

    React.useEffect(()=>{
        if(id){
            getWorkToUpdate(id)
        }else{
            reset(INITIAL_STATE);
            setItemsCertificates([])
            setWorkersSelected([])
            setCustomerSelected("")
        }
    },[id, reset])

    React.useEffect(() => {
        return () => {
            reset(INITIAL_STATE);
            setItemsCertificates([])
            setWorkersSelected([])
            setCustomerSelected("")
        };
    }, [reset]);

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

    const handleSelectOptions = async () => {
        setIsLoading(true)
        const p1 = handleGetAllStaff()
        const p2 = handleGetAllCustomers()
        const p3 = handleGetAllCertificates()
        try{
            await Promise.allSettled([ p1, p2, p3])
        }catch(error){
            console.error(error)
        }finally {
            setIsLoading(false)
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

    const handleGetAllStaff = async() => {
        try {
          const allStaff =  await getAllStaff()
          if (!allStaff) {
            console.error("No response from getAllStaff")
            return
        }
        workersRemote.current = allStaff
        const lstWorkers = allStaff
            .filter((res) => res.roles.some((role) => role === 'USER'))
            .map((res) => ({
                label: `${res.name} ${res.lastName}`,
                value: `${res.uid}`
            }));
        setWorkersList(lstWorkers)
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
              setWorkElementDetail(detailWork)
          }
        } catch (error) {
            console.error(error)
            openToast('error', JSON.stringify(error), "Error")
        }finally{
            setIsLoading(false)
        }
    }

    const handleChangeItemCertificates = (newValue: MultiValue<TOptions>) => {
       try {
           setItemsCertificates(newValue)
           const dataArray = newValue
           const typeWork = certificatesRemote.current
               .filter(item => dataArray
                   .map(data => data.value as string)
                   .includes(item.uid ?? ''));
           const typeWorkIds = typeWork.map((tw) => tw.uid)
           const workersLst = workersRemote.current
               .filter((wr) => wr.certificates?.some((cert) => typeWorkIds.includes(cert.uid)))
               .map((res) => ({
                   label: `${res.name} ${res.lastName}`,
                   value: `${res.uid}`
               }));
           setValue('typeWork', typeWork)

           if(workersLst.length === 0){
               let lstWorkers = workersRemote.current
                   .filter((res) => res.roles.some((role) => role === 'USER'))
                   .map((res) => ({
                       label: `${res.name} ${res.lastName}`,
                       value: `${res.uid}`
                   }));
               setWorkersList(lstWorkers)

           }

           if(workersLst.length > 0){
               setWorkersList(workersLst)
           }
       }catch (error){
            console.error(error)
       }

    }

    const handleChangeWorkersSelect = (newValue: MultiValue<TOptions>) => {
        setWorkersSelected(newValue)
        const dataArray = newValue
        const workersToSave =  workersRemote.current
            .filter(item => dataArray
                .map(data => data.value as string)
                .includes(item.uid ?? ''));
        setValue('workers', workersToSave)
    }

    const handleChangeCustomersSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const client = customersRemote.current.find((cr) => cr.uid === selectedValue)
        setCustomerSelected(client?.uid ?? '')
        setValue('customer', client)
    }

    const openAddWork = () => navigate('create')
    const openWorksTable = () => navigate('/works')
    const openEditWork = (uid: string) => navigate(`edit/${uid}`)
    const openViewDetail = (uid: string) => navigate(`detail/${uid}`)

    const handleCancel = () => {
        openWorksTable()
        reset()
    }


    const handleCreateUpdateWork = handleSubmit(async () =>{
        try {
            const data = getValues()
            if(id){
                await  updateWorkElement(id, data)
                openToast('success', "Work updated", 'Success')
                openWorksTable()
            }else{
                await createNewWorkElement(data)
                openToast('success', "New work created", 'Success')
                openWorksTable()
            }
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
    } )
    const getWorkToUpdate = async(uid:string) => {
        try {
            const work = await getWorkByUID(uid)
            if(work){
                reset({
                    ...work
                })

                const tWork = work.typeWork.map(w => ({ label: w.name, value: w.uid }))
                const workers = work.workers.map((w) => ({ label: w.name, value: w.uid ?? '' }))
                setItemsCertificates(tWork)
                setWorkersSelected(workers)
                if(work.customer){
                 setCustomerSelected(work.customer.uid)
                }
            }
        }catch(error){
            console.error(error)
        }
    }

    return {
        isLoading,
        data,
        openEditWork,
        handleDelete,
        openAddWork,
        isOpenDelete,
        onCloseDelete,
        handleConfirmDelete,
        workersList,
        handleGetAllStaff,
        handleGetAllCustomers,
        handleGetAllCertificates,
        certificatesList,
        customersList,
        openWorksTable,
        openViewDetail,
        handleGetElementDetail,
        workElementDetail,
        handleChangeWorkersSelect,
        handleChangeCustomersSelect,
        handleChangeItemCertificates,
        workersSelected,
        itemsCertificates,
        customerSelected,
        register,
        errors,
        isSubmitting,
        handleCancel,
        handleCreateUpdateWork,
        handleSelectOptions,
        getAllElements,
    }
}
