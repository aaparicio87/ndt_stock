import React, {ChangeEvent, useEffect} from "react";
import {FieldErrors, useForm, UseFormRegister} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNotification} from "../../../../hooks/useNotification.ts";
import {addWorkHours, editWorkHours, getAllCertificates, getAllCustomers} from "../../../../services";
import {MultiValue} from "react-select";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../../../state/features/auth/authSlice.tsx";
import {useDisclosure} from "@chakra-ui/react";
import {WORK_HOURS_VALIDATION_SCHEMA} from "../../../../utils/validationSchemas.ts";

const INITIAL_STATE: Partial<TWorkHour> = {
    date: "",
    client: undefined,
    location: "",
    ndtMethods: undefined,
    startTime: "",
    endTime: "",
    note: "",
}

export interface IWorkedHoursHooks {
    initialRef:  React.MutableRefObject<null>,
    finalRef :  React.MutableRefObject<null>,
    register: UseFormRegister<TWorkHour>,
    errors: FieldErrors<TWorkHour>,
    isSubmitting: boolean,
    customersList: TOptions[],
    certificatesList: TOptions[],
    itemsCertificates: MultiValue<TOptions>,
    customerSelected: string,
    handleChangeItemCertificates: (newValue: MultiValue<TOptions>)=>void,
    handleChangeCustomersSelect: (event: ChangeEvent<HTMLSelectElement>) => void,
    handleCreateWorkHour: (e?: (React.BaseSyntheticEvent<object, any, any> | undefined)) => Promise<void>,
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
    handleGetAllCustomers: ()=> Promise<void>,
    handleGetAllCertificates: ()=> Promise<void>,
    openToast: (status: TToastStatus, description: string, title: string) => void
    handleWorkHoursSelected: (workHour: TWorkHour | undefined)=>void
    workHourSelected: TWorkHour | undefined
}

export const useWorkedHours = (): IWorkedHoursHooks => {

    const { openToast } = useNotification()
    const user = useSelector(selectCurrentUser);
    const { isOpen, onOpen, onClose } = useDisclosure()
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
        }
    } = useForm<TWorkHour>({
        defaultValues: INITIAL_STATE,
        resolver: zodResolver(WORK_HOURS_VALIDATION_SCHEMA)
    });
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const customersRemote = React.useRef<TCustomer[]>([])
    const [customersList, setCustomersList] = React.useState<TOptions[]>([])
    const certificatesRemote = React.useRef<TCertificates[]>([])
    const [itemsCertificates, setItemsCertificates] = React.useState<MultiValue<TOptions>>([])
    const [certificatesList, setCertificatesList] = React.useState<TOptions[]>([])
    const [customerSelected, setCustomerSelected] = React.useState("")
    const [workHourSelected, setWorkHourSelected] = React.useState<TWorkHour | undefined>(undefined)

    useEffect(()=>{
        if(workHourSelected){
          reset({
              ...workHourSelected
          })
            if( workHourSelected.ndtMethods){
                const tWork = workHourSelected.ndtMethods.map(w => ({ label: w.name, value: w.uid }))
                setItemsCertificates(tWork)
            }
            setCustomerSelected(workHourSelected.client.uid)
        }
    }, [workHourSelected])

    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
        }
    }, [isSubmitSuccessful])

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

    const handleChangeItemCertificates = (newValue: MultiValue<TOptions>) => {
        try {
            setItemsCertificates(newValue)
            const dataArray = newValue
            const typeWork = certificatesRemote.current
                .filter(item => dataArray
                    .map(data => data.value as string)
                    .includes(item.uid ?? ''));

            setValue('ndtMethods', typeWork)

        }catch (error){
            console.error(error)
        }
    }

    const handleChangeCustomersSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const client = customersRemote.current.find((cr) => cr.uid === selectedValue)
        if(client){
            setCustomerSelected(client?.uid)
            setValue('client', client)
        }
    }

    const handleCreateWorkHour = handleSubmit(async () =>{
        const data = getValues()
        try {
                if(!user){
                    openToast('error', "Internal error, user is undefined", 'Error')
                    return
                }
                if(!user.roles.includes('USER')){
                    openToast('info', "You need to be a user to add your work hours", 'Info')
                    return
                }
                const {uid} = user
                if(!uid){
                    openToast('error', "Internal error, user uid is undefined", 'Error')
                    return
                }
               if(!workHourSelected){
                   await addWorkHours(uid, data)
                   openToast('success', "New worked hour created", 'Success')
               }else{
                   if(!workHourSelected.uid){
                       openToast('error', "Internal error, work hour uid is undefined", 'Error')
                       return
                   }
                   await editWorkHours(uid, workHourSelected.uid, data)
                   openToast('success', "Updated worked hour", 'Success')
               }

        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }finally {
            onClose()
        }
    } )

    const handleWorkHoursSelected = (workHour: TWorkHour | undefined) => {
        setWorkHourSelected(workHour)
    }

    return {
        initialRef,
        finalRef,
        register,
        errors,
        isSubmitting,
        customersList,
        certificatesList,
        itemsCertificates,
        customerSelected,
        handleChangeItemCertificates,
        handleChangeCustomersSelect,
        handleCreateWorkHour,
        isOpen,
        onOpen,
        onClose,
        handleGetAllCustomers,
        handleGetAllCertificates,
        openToast,
        handleWorkHoursSelected,
        workHourSelected,
    }
}
