import React from "react";
import { useSelector } from "react-redux";
import { useNotification } from "../../../../hooks/useNotification";
import { useDisclosure } from "@chakra-ui/react";
import { selectCurrentUser } from "../../../../state/features/auth/authSlice";
import { collection, onSnapshot } from "firebase/firestore";
import { FB_DB } from "../../../../config/firebase.conf";
import { CAPITALIZED_ROLES, STAFF } from "../../../../utils/constants";
import { 
    deleteStaffElement, 
    filterUser, 
    getAllCertificates, 
    getAllStaff, 
    getStaffInformationByUserUID,
    getWorkHours
 } from "../../../../services";
 import { Event } from 'react-big-calendar'
import { useNavigate } from "react-router-dom";
import { useFilterForm } from "../../../../hooks/useFilterForm";
import { FILTER_STAFF_VALIDATION_SCHEMA } from "../../../../utils/validationSchemas";
import { FieldErrors, UseFormRegister, UseFormResetField, UseFormSetValue } from "react-hook-form";
import { capitalizeFirstLetter } from "../../../../utils/functions";


 export interface IStaffTable {
    fullName: string
    email: string
    degree: string
    roles: string
    uid?: string
 }

 interface IFilter {
    name?: string | undefined 
    rolesFilter?: string[] | undefined
}

interface IOption {
    label: string, 
    value: string 
}

export interface IUseUser {
    handleViewDetails:(uid: string | undefined) =>Promise<void>,
    handleEdit: (uid: string | undefined) => Promise<void>,
    handleDelete: (item: string | undefined) => void,
    handleConfirmDelete: () => Promise<void>,
    closeModalAdd: ()=>void,
    user: TStaff | undefined,
    isOpenDelete: boolean,
    staffElement: TStaff | undefined,
    data: IStaffTable[],
    onOpen: ()=>void,
    isOpen: boolean,
    isOpenDetail: boolean,
    onCloseDelete: ()=>void,
    isLoading: boolean,
    certificatesList: IOption[],
    handleGetAllCertificates: () => Promise<void>,
    handleUserHours: (uid: string ) => Promise<void>,
    userWorkHours: Event[],
    openWorksUser: (uid: string) => void,
    errors: FieldErrors<IFilter>,
    isSubmitting: boolean,
    register: UseFormRegister<IFilter>,
    setValue: UseFormSetValue<IFilter>,
    handleFilterUsers: (e?: React.BaseSyntheticEvent) => Promise<void>
    resetField: UseFormResetField<IFilter>
    isSubmitSuccessful: boolean
}
 
 export const useUser = ():IUseUser => {
    const navigate = useNavigate()
    const { openToast } = useNotification()
    const user = useSelector(selectCurrentUser);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [staffElement, setStaffElement] = React.useState<TStaff | undefined>(undefined)
    const [staffElementDelete, setStaffElementDelete] = React.useState<string | undefined>(undefined)
    const [data, setData] = React.useState<IStaffTable[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [certificatesList, setCertificatesList] = React.useState<IOption[]>([])
    const [userWorkHours, setUserWorkHours] = React.useState<Event[]>([])
    const dataRef = React.useRef<IStaffTable[]>([])

    const {
        errors,
        getValues,
        handleSubmit,
        isSubmitting,
        register,
        setValue,
        resetField,
        isSubmitSuccessful,
   } = useFilterForm<IFilter>(FILTER_STAFF_VALIDATION_SCHEMA)

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(FB_DB, STAFF), (_) => {
            getAllElements()
        })
        return () => unsubscribe();
    }, [])

    const getAllElements = async () => {
        setIsLoading(true)
        try {
            const staffData = await getAllStaff();
            if (staffData) {
                const staffDataTable = staffData.map((staff) => {
                    const staffTableData: IStaffTable = {
                        degree: staff.degree ?? '',
                        email: staff.email,
                        fullName: `${capitalizeFirstLetter(staff.name)} ${capitalizeFirstLetter(staff.lastName)}`,
                        roles: staff.roles.map((role) => CAPITALIZED_ROLES[role]).join(', '),
                        uid: staff.uid
                    }
                    return staffTableData
                })
                dataRef.current = staffDataTable
                setData(staffDataTable)
            }
        } catch (error) {
            openToast('error', (error as Error).message, "Error")
        }
        finally{
            setIsLoading(false)
        }
    }

    const handleGetAllCertificates = async() => {
        try {
            const certificates = await getAllCertificates()
            if(certificates){
                const list = certificates
                    .map((res) => ({
                        label: res.name,
                        value: res.uid
                    }));
                setCertificatesList(list)
            }
        } catch (error) {
            openToast('error',`Error fetching staff: ${(error as Error).message}`, "Error")
        }
    }

    const handleViewDetails = async (uid: string | undefined) => {
        try {
            if (uid) {
                const staff = await getStaffInformationByUserUID(uid)
                if(staff !== null){
                    setStaffElement(staff)
                    onOpenDetail()
                }
            }
        } catch (error) {
            openToast('error',`${(error as Error).message}`, "Error")
        }
    }

    const handleEdit = async (uid: string | undefined) => {
        if (uid) {
            let staff = await getStaffInformationByUserUID(uid)
            if(staff !== null){
                setStaffElement(staff)
                onOpen()
            }
        }
        onOpen()
    }

    const handleUserHours = async (uid: string ) => {
        try {
            setIsLoading((prev) => !prev)
            getWorkHours(uid)
                .then((result) => {
                    const events: Event[] = result.map((wh) => {
                        const start = new Date(`${wh.date}T${wh.startTime}:00`)
                        const end = new Date(`${wh.date}T${wh.endTime}:00`)
                        return {
                            title: wh.client.name,
                            start,
                            end,
                            resource: {
                            ...wh,
                            }
                        }
                        })
                    setUserWorkHours(events)
                })
                .finally(()=>{
                    setIsLoading(false)
                })
            
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
    }

    const handleDelete = (item: string | undefined) => {
        setStaffElementDelete(item)
        onOpenDelete()
    }

    const handleConfirmDelete = async () => {
        try {
            if (staffElementDelete)
                await deleteStaffElement(staffElementDelete)
            onCloseDelete()
            openToast('success', "Element deleted successfully", 'Success')
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
    }

    const closeModalAdd = () => {
        if (isOpen) {
            onClose()
            setStaffElement(undefined)
        } else if (isOpenDetail) {
            onCloseDetail()
            setStaffElement(undefined)
        }
    }

    const openWorksUser = (uid: string) => navigate(`workhours/${uid}`)

    const handleFilterUsers = handleSubmit(async() => {
        setIsLoading(true)
        const data = getValues()
        try {
            const response = await filterUser(data)
            if(response){
                const staffDataTable = response.map((staff) => {
                    const staffTableData: IStaffTable = {
                        degree: staff.degree ?? '',
                        email: staff.email,
                        fullName: `${capitalizeFirstLetter(staff.name)} ${capitalizeFirstLetter(staff.lastName)}`,
                        roles: staff.roles.join(', '),
                        uid: staff.uid
                    }
                    return staffTableData
                })
                if(dataRef.current.length > 0 ){
                    dataRef.current = []
                }
                setData(staffDataTable)
            }else{
                if(dataRef.current.length === 0){
                    await getAllElements()
                }
            }
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
        finally{
            setIsLoading(false)
        }
    })

    return {
        handleViewDetails,
        handleEdit,
        handleDelete,
        handleConfirmDelete,
        closeModalAdd,
        user,
        isOpenDelete,
        staffElement,
        data,
        onOpen,
        isOpen,
        isOpenDetail,
        onCloseDelete,
        isLoading,
        certificatesList,
        handleGetAllCertificates,
        handleUserHours,
        userWorkHours,
        openWorksUser,
        errors,
        isSubmitting,
        register,
        setValue,
        handleFilterUsers,
        resetField,
        isSubmitSuccessful,
    }
}