import React, {ChangeEvent, useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {STAFF_VALIDATION_SCHEMA} from "../../../../utils/validationSchemas.ts";
import {useNotification} from "../../../../hooks/useNotification.ts";
import {getAllCertificates, getAllCustomers, updateStaffElement} from "../../../../services";
import {MultiValue} from "react-select";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser, updateUserData} from "../../../../state/features/auth/authSlice.tsx";
import {AppDispatch} from "../../../../state/store.ts";

const INITIAL_STATE: Partial<TWorkHour> = {
    date: "",
    client: undefined,
    location: "",
    ndtMethods: undefined,
    startTime: "",
    endTime: "",
    note: "",
}

export const useWorkedHours = (item:  TWorkHour | undefined) => {

    const { openToast } = useNotification()
    const user = useSelector(selectCurrentUser);
    const dispatch:AppDispatch = useDispatch()
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
        resolver: zodResolver(STAFF_VALIDATION_SCHEMA)
    });
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const customersRemote = React.useRef<TCustomer[]>([])
    const [customersList, setCustomersList] = React.useState<TOptions[]>([])
    const certificatesRemote = React.useRef<TCertificates[]>([])
    const [itemsCertificates, setItemsCertificates] = React.useState<MultiValue<TOptions>>([])
    const [certificatesList, setCertificatesList] = React.useState<TOptions[]>([])
    const [customerSelected, setCustomerSelected] = React.useState("")

    React.useEffect(()=>{
        const customers = handleGetAllCustomers()
        const certificates = handleGetAllCertificates()
        Promise.allSettled([customers,certificates])
            .catch((errors) => openToast('error', JSON.stringify(errors), "Error"))

    },[])

    useEffect(()=>{
        if(item){
          reset({
              ...item
          })
            if( item.ndtMethods){
                const tWork = item.ndtMethods.map(w => ({ label: w.name, value: w.uid }))
                setItemsCertificates(tWork)
            }
            setCustomerSelected(item.client.uid)
        }
    }, [item])

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
            if(user){
                const {uid, wHours} = user
                if(uid){
                    let dataUpdate = wHours
                    if(dataUpdate){
                        dataUpdate = [...dataUpdate, data]
                    }else{
                        dataUpdate = [data]
                    }
                    let userUpdate = {...user}
                    userUpdate = {...userUpdate, wHours: dataUpdate}
                    await updateStaffElement(uid, userUpdate)
                    dispatch(updateUserData(userUpdate))
                    openToast('success', "New worked hour created", 'Success')
                }
            }
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
    } )

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
        handleCreateWorkHour
    }
}
