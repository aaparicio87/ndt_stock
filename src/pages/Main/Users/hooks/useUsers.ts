import React, { ChangeEvent } from "react";
import {  useSelector } from "react-redux";
import { useNotification } from "../../../../hooks/useNotification";
import { useDisclosure } from "@chakra-ui/react";
import { selectCurrentUser } from "../../../../state/features/auth/authSlice";
import { collection, onSnapshot } from "firebase/firestore";
import { FB_DB, FB_STORAGE } from "../../../../config/firebase.conf";
import { CAPITALIZED_ROLES, STAFF } from "../../../../utils/constants";
import { 
    deleteStaffElement, 
    filterUser, 
    getAllCertificates, 
    getAllStaff, 
    getStaffInformationByUserUID,
    getWorkHours,
    registerUser,
    updateStaffElement
 } from "../../../../services";
 import { Event } from 'react-big-calendar'
import { useNavigate } from "react-router-dom";
import { useFilterForm } from "../../../../hooks/useFilterForm";
import { FILTER_STAFF_VALIDATION_SCHEMA, STAFF_VALIDATION_SCHEMA } from "../../../../utils/validationSchemas";
import { 
    FieldErrors, 
    useForm, 
    UseFormRegister,
    UseFormResetField, 
    UseFormSetValue 
} from "react-hook-form";
import { 
    capitalizeFirstLetter, 
    getUserCertificatesEdit, 
    getUserCertificatesName, 
    handleGetCertificates 
} from "../../../../utils/functions";
import { MultiValue } from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


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

type TInitialState = TStaff & {
    profileImage: File | null;
}

const INITIAL_STATE: TInitialState = {
    email: "",
    lastName: "",
    name: "",
    roles: [],
    degree: "",
    photoUrl: "",
    certificates: [],
    profileImage: null
}


export interface IUseUser {
    handleViewDetails:(uid: string | undefined) =>Promise<void>,
    handleEdit: (uid?: string) => Promise<void>,
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
    certificatesList: TOptions[],
    handleGetAllCertificates: () => Promise<void>,
    handleUserHours: (uid: string ) => Promise<void>,
    userWorkHours: Event[],
    openWorksUser: (uid: string) => void,
    isSubmitingFilter: boolean,
    errorsFilter: FieldErrors<IFilter>,
    registerFilter: UseFormRegister<IFilter>,
    setValueFilter: UseFormSetValue<IFilter>,
    resetFieldFilter: UseFormResetField<IFilter>
    handleFilterUsers: (e?: React.BaseSyntheticEvent) => Promise<void>
    isSubmitSuccessful: boolean,
    handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void
    loading: boolean
    itemsCertificates: MultiValue<TOptions>
    itemsRoles: MultiValue<TOptions>
    selectedImage: string | ArrayBuffer | null
    onSubmitUser: (e?: React.BaseSyntheticEvent) => Promise<void>
    register: UseFormRegister<TInitialState>
    errors: FieldErrors<TInitialState>
    isSubmitting: boolean
    onChangeItemCertificates: (data: MultiValue<TOptions>) => void
    onChangeItemRoles: (data: MultiValue<TOptions>) => void
    certificatesDetails: string[]
    
}
 
 export const useUser = ():IUseUser => {
    const navigate = useNavigate()
    const user = useSelector(selectCurrentUser);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [staffElement, setStaffElement] = React.useState<TStaff | undefined>(undefined)
    const [staffElementDelete, setStaffElementDelete] = React.useState<string | undefined>(undefined)
    const [data, setData] = React.useState<IStaffTable[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [certificatesList, setCertificatesList] = React.useState<TOptions[]>([])
    const [userWorkHours, setUserWorkHours] = React.useState<Event[]>([])
    const dataRef = React.useRef<IStaffTable[]>([])
    const certificatesRef = React.useRef<TCertificates[] | undefined>(undefined)
    const [loading, setLoading] = React.useState(true)
    const [itemsCertificates, setItemsCertificates] = React.useState<MultiValue<TOptions>>([])
    const [itemsRoles, setItemsRoles] = React.useState<MultiValue<TOptions>>([])
    const [selectedImage, setSelectedImage] = React.useState<string | ArrayBuffer | null>(null);
    const [certificatesDetails, setCertificatesDetails] = React.useState<string[]>([])
    const { openToast } = useNotification()

    const { 
        register, 
        handleSubmit, 
        reset, 
        setValue, 
        getValues, 
        formState: { 
            errors, 
            isSubmitting,
            isSubmitSuccessful 
        } } = useForm<TInitialState>({
        defaultValues: INITIAL_STATE,
        resolver: zodResolver(STAFF_VALIDATION_SCHEMA)
    });

    const {
        errors: errorsFilter,
        getValues: getValuesFilter,
        handleSubmit: handleSubmitFilter,
        isSubmitting: isSubmitingFilter,
        register: registerFilter,
        setValue: setValueFilter,
        resetField: resetFieldFilter,
        isSubmitSuccessful: isSubmitSuccessfulFilter,
   } = useFilterForm<IFilter>(FILTER_STAFF_VALIDATION_SCHEMA)

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(FB_DB, STAFF), (_) => {
            getAllElements()
        })
        return () => unsubscribe();
    }, [])


    React.useEffect(() => {
        if (isSubmitSuccessfulFilter) {
            reset()
            setItemsCertificates([])
            setItemsRoles([])
            onClose()
        }
    }, [isSubmitSuccessfulFilter])

    const getAllElements = async () => {
        setIsLoading((prev) => !prev)
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
            certificatesRef.current = certificates
            if(certificates){
                const listCerts = handleGetCertificates(certificates)
                setCertificatesList(listCerts)
            }
        } catch (error) {
            openToast('error',`Error fetching staff: ${(error as Error).message}`, "Error")
        }
    }

    const handleViewDetails = async (uid: string | undefined) => {
        setLoading((prev) => !prev)
        try {
            if (uid) {
                const staff = await getStaffInformationByUserUID(uid)
                if(staff !== null){
                    const certificates = await getAllCertificates()
                    if(certificates && staff.certificates){
                        const result = getUserCertificatesName(staff.certificates, certificates)
                        setCertificatesDetails(result)
                    }
                    setStaffElement(staff)
                    onOpenDetail()
                }
            }
        } catch (error) {
            openToast('error',`${(error as Error).message}`, "Error")
        }finally{
            setLoading(false)
        }
    }

    const handleEdit = async (uid?: string) => {
        setLoading((prev) => !prev)
        try {
            await handleGetAllCertificates()
            if (uid) {
                let staff = await getStaffInformationByUserUID(uid)
                if(staff !== null){
                    setStaffElement(staff)
                    const roles = staff.roles.map(rol => ({ label: rol, value: rol.toLowerCase() }))
                    setItemsRoles(roles)
                    if(staff.certificates && certificatesRef.current){
                        const response = getUserCertificatesEdit(staff.certificates, certificatesRef.current)
                        setItemsCertificates(response)
                    }
                    setItemsCertificates
                    reset({ 
                        ...staff, 
                        name: capitalizeFirstLetter(staff.name), 
                        lastName: capitalizeFirstLetter(staff.lastName), 
                    });
                }
            } else {
                reset(INITIAL_STATE);
                setItemsCertificates([]);
                setItemsRoles([]);
            }
           
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        } finally{
            onOpen()
            setLoading(false)
        }
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

    const handleFilterUsers = handleSubmitFilter(async() => {
        setIsLoading(true)
        const data = getValuesFilter()
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

    const onSubmitUser = handleSubmit( async () => {
        let url = ""
        const data = getValues()
        try {
            if (data.profileImage && data.profileImage !== null) {
                const storageRef = ref(FB_STORAGE, `images/${data.profileImage.name}`);
                const result = await uploadBytes(storageRef, data.profileImage)
                url = await getDownloadURL(result.ref);
            }
            if (staffElement?.uid) {
                let updatedData = { ...data }
                if (url.length > 0) {
                    updatedData = {
                        ...updatedData,
                        photoUrl: url,
                        name: updatedData.name.toLowerCase(),
                        lastName: updatedData.lastName.toLowerCase(),
                    }
                }
                await updateStaffElement(staffElement.uid, updatedData)
                openToast('success', "User updated successfully", 'Success')

            } else {
                const updatedDataCreate = {
                    ...data,
                    photoUrl: url,
                    name: data.name.toLowerCase(),
                    lastName: data.lastName.toLowerCase(),
                }
                const response = await registerUser(updatedDataCreate)
                if (response.success) {
                    openToast('success', "New user added to the staff", 'Success')
                } else {
                    openToast('error', response.error ?? 'Internal server Error', "Error")

                }
            }
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
        finally{
            closeModalAdd()
        }
    }) 

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png'];
            const maxSizeInMB = 2;
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

            if (!validImageTypes.includes(file.type)) {
                openToast('error', 'Only JPG and PNG images are allowed', 'Invalid file type');
                return;
            }

            if (file.size > maxSizeInBytes) {
                openToast('error', `Image size should not exceed ${maxSizeInMB} MB`, 'File too large');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setValue('profileImage', file);
            };
            reader.readAsDataURL(file);
        }
    }

    function transformSelectedElements(
        certificates:TCertificates[], 
        selectedElements: {
            certId: string;
            levelId: string;
        }[]
    ): IUserCertificate[] {
        
        const userCertificatesMap: Record<string, IUserCertificate> = {};
    
        selectedElements.forEach(selection => {
            const { certId, levelId } = selection;
            
            const cert = certificates.find(cert => cert.uid === certId);
            if (!cert) return;
    
            const level = cert.levels.find(level => level.uid === levelId);
            if (!level) return;
    
            if (!userCertificatesMap[certId]) {
                userCertificatesMap[certId] = {
                    uid: certId,
                    levels: []
                };
            }

            userCertificatesMap[certId].levels.push(level);
        });
        
        return Object.values(userCertificatesMap);
    }

    const onChangeItemCertificates = (data: MultiValue<TOptions>) => {
        setItemsCertificates(data) 
        if(certificatesRef.current){
            const certsSelecetd = data
                            .map((d) => {
                                const ids = d.value.split('-')
                                return {
                                    certId:ids[0],
                                    levelId:ids[1]
                                }
                            })
                            .filter((d) => d !== undefined)
            const dataTransformed =  transformSelectedElements(certificatesRef.current, certsSelecetd)               
            setValue('certificates',dataTransformed)                
        }
    }

    const onChangeItemRoles = (data: MultiValue<TOptions>) => {
        setItemsRoles(data)
        const roles = data.map((r) => r.label as TRole)
        setValue('roles', roles)
    }

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
        errorsFilter,
        isSubmitingFilter,
        registerFilter,
        setValueFilter,
        handleFilterUsers,
        isSubmitSuccessful,
        resetFieldFilter,
        loading,
        itemsCertificates,
        handleImageChange,
        itemsRoles,
        selectedImage,
        onSubmitUser,
        errors,
        isSubmitting,
        register,
        onChangeItemCertificates,
        onChangeItemRoles,
        certificatesDetails
    }
}