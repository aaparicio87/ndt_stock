import React, {ChangeEvent, useEffect} from "react";
import {FieldErrors, useForm, UseFormRegister} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNotification} from "../../../../hooks/useNotification.ts";
import {addWorkHours, editWorkHours, getAllCertificates, getAllCustomers, getWorkHours} from "../../../../services";
import {MultiValue} from "react-select";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../../../state/features/auth/authSlice.tsx";
import {useDisclosure} from "@chakra-ui/react";
import {WORK_HOURS_VALIDATION_SCHEMA} from "../../../../utils/validationSchemas.ts";
import { Event, View, Views } from 'react-big-calendar'
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek} from 'date-fns'
import { calculateEventDuration } from "../../../../utils/functions.ts";


const INITIAL_STATE: Partial<TWorkHour> = {
    date: new Date().toISOString().split("T")[0],
    client: undefined,
    location: "",
    ndtMethods: undefined,
    startTime: new Date().toTimeString().split(" ")[0].slice(0, 5),
    endTime: new Date().toTimeString().split(" ")[0].slice(0, 5),
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
    handleGetAllCustomers: ()=> Promise<void>,
    handleGetAllCertificates: ()=> Promise<void>,
    openToast: (status: TToastStatus, description: string, title: string) => void
    handleWorkHoursSelected: (workHour: TWorkHour | undefined)=>void
    workHourSelected: TWorkHour | undefined
    handleGetWorkHoursByUser: ()=> Promise<void>
    userWorkHours: Event[]
    handleCloseModal: () => void,
    onViewChange: (view: View) => void
    visibleHours: string
    onNavigate: (newDate: Date) => void
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
    const [userWorkHours, setUserWorkHours] = React.useState<Event[]>([])
    const [currentView, setCurrentView] = React.useState<View>(Views.MONTH);
    const [visibleHours, setVisibleHours] = React.useState('');
    const [currentDate, setCurrentDate] = React.useState(new Date());

    useEffect(() => {
        handleGetWorkHoursByUser()
    }, [])
    
    useEffect(() => {
        calculateWorkedHours(userWorkHours, currentView, currentDate);
      }, [currentView, userWorkHours, currentDate]);

    useEffect(()=>{
        if(workHourSelected){
          reset({
              ...workHourSelected
          })
            if( workHourSelected.ndtMethods){
                const tWork = workHourSelected.ndtMethods
                                    .filter((ndt) => ndt)
                                    .map(w => ({ label: w.name, value: w.uid  as string}))
                setItemsCertificates(tWork)
            }
            setCustomerSelected(workHourSelected.client.uid)
        }
    }, [workHourSelected])

    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset(INITIAL_STATE)
            setCustomerSelected("")
            setItemsCertificates([])
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
                    .filter((ndt) => ndt)
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
            openToast('error',`${(error as Error).message}`, "Error")
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
            handleGetWorkHoursByUser()
            onClose()
        }
    } )

    const handleWorkHoursSelected = (workHour: TWorkHour | undefined) => {
        setWorkHourSelected(workHour)
    }

    const handleGetWorkHoursByUser = async() => {
        try {
            if(user?.uid){
              const result  = await getWorkHours(user.uid)
              if(result.length > 0){
               const response = result.map((wh) => {
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
                setUserWorkHours(response)
              }
            }
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
    }

    const handleCloseModal = () => {
        onClose()
        reset(INITIAL_STATE)
        setCustomerSelected("")
        setItemsCertificates([])
    }

    const onViewChange = (view: View) => {
        setCurrentView(view);
    };

    const onNavigate = (newDate: Date) => {
        setCurrentDate(newDate);
    };

    const calculateWorkedHours = (events: Event[], view: View, date: Date) => {
        let totalMinutes = 0;
    
        // Filter events that are in the visible range based on the current view and date
        const visibleEvents = events.filter((event) => {
            switch (view) {
                case Views.DAY:
                    const startOfDayDate = startOfDay(date);
                    const endOfDayDate = endOfDay(date);
                    return isEventInRange(event, startOfDayDate, endOfDayDate);
                case Views.WEEK:
                    const startOfWeekDate = startOfWeek(date);
                    const endOfWeekDate = endOfWeek(date);
                    return isEventInRange(event, startOfWeekDate, endOfWeekDate);
                case Views.MONTH:
                    const startOfMonthDate = startOfMonth(date);
                    const endOfMonthDate = endOfMonth(date);
                    return isEventInRange(event, startOfMonthDate, endOfMonthDate);
                default:
                    return false;
            }
        });
    
        // Calculate the total minutes for the visible events
        visibleEvents.forEach((event) => {
            if (event.end && event.start) {
                totalMinutes += calculateEventDuration(event.start, event.end);
            }
        });
    
        // Convert total minutes to hours and minutes
        if (totalMinutes < 60) {
            setVisibleHours(`${totalMinutes} minutes`);
        } else {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            setVisibleHours(`${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` and ${minutes} minutes` : ''}`);
        }
    };
    
    
    const isEventInRange = (event: Event, start: Date, end: Date) => {
        
        if (!event.start || !event.end) {
            return false;
        }
    
        // Ajuste para eventos que cruzan la medianoche
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
    
        // Si el evento cruza la medianoche
        if (eventEnd < eventStart) {
            return (eventStart >= start && eventStart <= end) || (eventEnd.getTime() + 86400000 >= start.getTime() && eventEnd.getTime() + 86400000 <= end.getTime());
        }
    
        return (eventStart >= start && eventStart <= end) || (eventEnd >= start && eventEnd <= end);
    };

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
        handleGetAllCustomers,
        handleGetAllCertificates,
        openToast,
        handleWorkHoursSelected,
        workHourSelected,
        handleGetWorkHoursByUser,
        userWorkHours,
        handleCloseModal,
        onViewChange,
        visibleHours,
        onNavigate  
    }
}
