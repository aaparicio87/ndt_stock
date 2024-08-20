import React, {ChangeEvent} from "react"
import {
    deleteWorkElement,
    getAllCustomers,
    getAllStaff,
    getAllCertificates,
    getWorkByUID,
    createNewWorkElement,
    updateWorkElement,
    getAllWorksOrder,
    getAllWorksByDateRange,
} from "../../../../services"
import {useNavigate, useParams} from "react-router-dom"
import { useDisclosure } from "@chakra-ui/react"
import { useNotification } from "../../../../hooks/useNotification"
import {FieldErrors, useForm, UseFormRegister, UseFormReset} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {WORKS_FILTER_VALIDATION_SCHEMA, WORKS_VALIDATION_SCHEMA} from "../../../../utils/validationSchemas";
import {MultiValue} from "react-select";
import { useFilterForm } from "../../../../hooks/useFilterForm"
import { capitalizeFirstLetter } from "../../../../utils/functions"


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
    distance?: number,
    startTimeTravel?: string,
    stopTimeTravel?: string,
    carPlate?: string,
    travelFrom?: string,
    travelTo?: string,
    maxWorkedHours:number,
    traveling: string,
}

interface IFilter {
    startDate:string,
    endDate: string,
}


const INITIAL_STATE: Partial<TWork> = {
    typeWork: [],
    workers: [],
    customer: undefined,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    description: "",
    reportNumber: "",
    reportPlace: "",
    address: "",
    invoiceNumber: "",
    films: 0,
    cans: 0,
    maxWorkedHours:0,
    needToDeliver: false,
    traveling: false,
    distance: 0,
    startTimeTravel: new Date().toTimeString().split(" ")[0].slice(0, 5),
    stopTimeTravel: new Date().toTimeString().split(" ")[0].slice(0, 5),
    carPlate: "",
    travelFrom: "",
    travelTo: ""
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
    errorsFilter: FieldErrors<IFilter>,
    isSubmittingFilter: boolean,
    registerFilter:UseFormRegister<IFilter>
    handleFilterWorks: () => Promise<void>
    isSubmitSuccessfulFilter: boolean
    handleResetFilter: () => Promise<void>
    resetFilter:UseFormReset<IFilter>
    handleToogleTraveling: () => void
    showTraveling: boolean
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

   const {
        errors:errorsFilter,
        getValues:getValuesFilter,
        handleSubmit:handleSubmitFilter,
        isSubmitting:isSubmittingFilter,
        register:registerFilter,
        isSubmitSuccessful:isSubmitSuccessfulFilter,
        reset:resetFilter,
   } = useFilterForm<IFilter>(
        WORKS_FILTER_VALIDATION_SCHEMA, {
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
        }
    )

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
    const [showTraveling, setShowTraveling] = React.useState(false)

    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset(INITIAL_STATE)
            setItemsCertificates([])
            setWorkersSelected([])
            setCustomerSelected("")
            setShowTraveling(false)
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
            const workData = await getAllWorksOrder();
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
            openToast('error',`${(error as Error).message}`, "Error")
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
            openToast('error',`${(error as Error).message}`, "Error")
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
                    .filter((cert) => cert.uid)
                    .map((res) => ({
                        label: res.name,
                        value: res.uid as string
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
            openToast('error',`No response from getAllStaff`, "Error")
            return
        }
        workersRemote.current = allStaff
        const lstWorkers = allStaff
            .filter((res) => res.roles.some((role) => role === 'USER'))
            .map((res) => ({
                label: `${capitalizeFirstLetter(res.name)} ${capitalizeFirstLetter(res.lastName)}`,
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
        let detailWork:IDetailWork | undefined
        try {
          const work =  await getWorkByUID(uid)
          if(work !== null){
            detailWork = {
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
                workers: work.workers.map((ws) => `${ws.name} ${ws.lastName}`).join(', '),
                traveling: work.traveling ? "Yes" : "No",
                maxWorkedHours: Number(work.maxWorkedHours)
            }
             if(work.traveling){
                detailWork = {
                    ...detailWork,
                    distance: Number(work.distance) ?? 0,
                    startTimeTravel: work.startTimeTravel ?? '-',
                    stopTimeTravel: work.stopTimeTravel ?? '-',
                    carPlate: work.carPlate ?? '-',
                    travelFrom: work.travelFrom ?? '-',
                    travelTo: work.travelTo ?? '-',
                }
             }
              setWorkElementDetail(detailWork)
          }
        } catch (error) {
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
                   label: `${capitalizeFirstLetter(res.name)} ${capitalizeFirstLetter(res.lastName)}`,
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
        openToast('error',`${(error as Error).message}`, "Error")
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
        setShowTraveling(false)
        openWorksTable()
        reset(INITIAL_STATE)
    }

    const handleCreateUpdateWork = handleSubmit(async () =>{
        const data = getValues()
        try {
            if(id){
                await updateWorkElement(id, data)
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
                const data = {
                    ...INITIAL_STATE,
                    ...work
                }
                reset(data)
                setShowTraveling(data.traveling)
                const tWork = work.typeWork.filter((tw) => tw.uid).map(w => ({ label: w.name, value: w.uid as string }))
                const workers = work.workers.map((w) => ({ label: w.name, value: w.uid ?? '' }))
                setItemsCertificates(tWork)
                setWorkersSelected(workers)
                if(work.customer){
                 setCustomerSelected(work.customer.uid)
                }
            }
        }catch(error){
            openToast('error',`${(error as Error).message}`, "Error")
        }
    }

    const handleFilterWorks = handleSubmitFilter(async ()=>{
        setIsLoading(true)
        const {startDate, endDate} = getValuesFilter()
        try{
            const workData = await getAllWorksByDateRange(startDate, endDate)
            if (workData) {
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
                worksRemoteRef.current = []
                setData(dataTable)
            }
        }catch (error) {
            openToast('error',`${(error as Error).message}`, "Error")
        }finally{
            setIsLoading(false)
        }
    })

    const handleResetFilter = async() => {
        setIsLoading(true)
        try {
            resetFilter()
            await getAllElements()
        } catch (error) {
            openToast('error',`${(error as Error).message}`, "Error")
        }finally{
            setIsLoading(false)
        }
    }

    const handleToogleTraveling = () => {
        setShowTraveling((prev) => !prev)
        
        reset({
            ...getValues(),
            distance: 0,
            startTimeTravel: new Date().toTimeString().split(" ")[0].slice(0, 5),
            stopTimeTravel: new Date().toTimeString().split(" ")[0].slice(0, 5),
            carPlate: "",
            travelFrom: "",
            travelTo: ""
        })
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
        errorsFilter,
        isSubmittingFilter,
        registerFilter,
        handleFilterWorks,
        isSubmitSuccessfulFilter,
        handleResetFilter,
        resetFilter,
        handleToogleTraveling,
        showTraveling
    }
}
