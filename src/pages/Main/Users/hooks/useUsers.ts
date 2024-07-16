import React from "react";
import { useSelector } from "react-redux";
import { useNotification } from "../../../../hooks/useNotification";
import { useDisclosure } from "@chakra-ui/react";
import { selectCurrentUser } from "../../../../state/features/auth/authSlice";
import { collection, onSnapshot } from "firebase/firestore";
import { FB_DB } from "../../../../config/firebase.conf";
import { STAFF } from "../../../../utils/constants";
import { 
    deleteStaffElement, 
    getAllCertificates, 
    getAllStaff, 
    getStaffInformationByUserUID,
    getWorkHours
 } from "../../../../services";
 import { Event } from 'react-big-calendar'
import { useNavigate } from "react-router-dom";


 export interface IStaffTable {
    fullName: string
    email: string
    degree: string
    roles: string
    uid?: string
 }

interface IOption {
    label: string, 
    value: string 
}
 
 export const useUser = () => {
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
                        fullName: `${staff.name} ${staff.lastName}`,
                        roles: staff.roles.join(', '),
                        uid: staff.uid
                    }
                    return staffTableData
                })
                setData(staffDataTable)
            }
        } catch (error) {
            console.error(error)
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
            console.error("Error fetching staff: ", error)
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
            console.error(error)
        }
    }

    const handleEdit = async (uid: string | undefined) => {
        if (uid) {
            const staff = await getStaffInformationByUserUID(uid)
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
        openWorksUser
    }
}