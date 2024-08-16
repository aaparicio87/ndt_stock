import React, { ChangeEvent } from "react"
import { useDisclosure } from "@chakra-ui/react"
import { useNotification } from "../../../../hooks/useNotification"
import { collection, onSnapshot } from "firebase/firestore"
import { FB_DB } from "../../../../config/firebase.conf"
import { 
    STOCK, 
    TRADEMARK, 
    TYPE_EQUIPMENTS 
} from "../../../../utils/constants"
import { 
    createNewStockElement, 
    deleteStockElement, 
    getAllStcokElements, 
    updateStockElement 
} from "../../../../services"
import { zodResolver } from "@hookform/resolvers/zod"
import { STOCK_VALIDATION_SCHEMA } from "../../../../utils/validationSchemas"
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form"

export interface IUseStock {
    handleViewDetails:(item: TStock) => void
    handleEdit: (item: TStock) => void
    handleDelete: (item: TStock) => void
    handleConfirmDelete: () => Promise<void>
    isOpen: boolean,
    isOpenDetail: boolean
    onCloseDetail:() => void
    isOpenDelete: boolean
    stockElement:TStock | undefined
    data:TStock[]
    onOpen:() => void
    onCloseDelete:() => void
    isLoading: boolean
    register: UseFormRegister<TInitialState>
    errors: FieldErrors<TInitialState>
    isSubmitting: boolean,
    handleCreate: (e?: React.BaseSyntheticEvent) => Promise<void>
    handleChangeTypeEquipment: (event: ChangeEvent<HTMLSelectElement>) => void
    handleChangeTrademark: (event: ChangeEvent<HTMLSelectElement>) => void
    isOtherTypeSelected: boolean
    isOtherTradeMarkSelected: boolean
    handleCancelAdd: () => void
}

type TInitialState = TStock & {
    otherTypeEquipment: string
    otherTrademark: string
}

const INITIAL_STATE: TInitialState = {
    serialNumber: "",
    model: "",
    typeEquipment: "",
    tradeMark: "",
    store: "",
    calibrationDate: new Date().toISOString().split("T")[0],
    qualityOfService: "",
    remarks: "",
    otherTypeEquipment: "",
    otherTrademark: "",
}

export const useStock = (): IUseStock => {

    const { openToast } = useNotification()
    const [isOtherTypeSelected, setIsOtherTypeSelected] = React.useState(false);
    const [isOtherTradeMarkSelected, setIsOtherTradeMarkSelected] = React.useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [stockElement, setStockElement] = React.useState<TStock | undefined>(undefined)
    const [stockElementDelete, setStockElementDelete] = React.useState<TStock | undefined>(undefined)
    const [isLoading, setIsLoading] = React.useState(false)
    const [data, setData] = React.useState<TStock[]>([])

    const { 
        register, 
        handleSubmit, 
        reset, 
        setValue, 
        getValues, 
        formState: { errors, isSubmitting, isSubmitSuccessful } 
    } = useForm<TInitialState>({
        defaultValues: INITIAL_STATE,
        resolver: zodResolver(STOCK_VALIDATION_SCHEMA)
    });

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(FB_DB, STOCK), (_) => {
            getAllElements()
        })
        return () => unsubscribe();
    }, [])

    React.useEffect(() => {
        reset(INITIAL_STATE)
        setIsOtherTypeSelected(false)
        setIsOtherTradeMarkSelected(false)
    }, [isSubmitSuccessful])

    const getAllElements = async () => {
        setIsLoading((prev) => !prev)
        try {
            const stockData = await getAllStcokElements();
            setData(stockData)
        } catch (error) {
            openToast('error', (error as Error).message, "Error")
        } finally{
            setIsLoading(false)
        }
    }

    const handleChangeTypeEquipment = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setIsOtherTypeSelected(selectedValue === 'others');
        if (selectedValue !== 'others') {
            setValue('otherTypeEquipment', "");
        }
    }

    const handleChangeTrademark = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setIsOtherTradeMarkSelected(selectedValue === 'others');
        if (selectedValue !== 'others') {
            setValue('otherTrademark', "");
        }
    }

    const handleCancelAdd = () =>{
        reset(INITIAL_STATE)
        onClose()
    }

    const handleViewDetails = (item: TStock) => {
        setStockElement(item)
        onOpenDetail()
    }
    
    const handleEdit =  (item: TStock) => {
        reset(item)
        setStockElement(item)
        const isOtherTypeEquipment = TYPE_EQUIPMENTS.filter((type) => type === item.typeEquipment)
        const isOtherTradeMark = TRADEMARK.filter((trademark) => trademark === item.tradeMark)

        if (isOtherTypeEquipment.length === 0) {
            setIsOtherTypeSelected((prev) => !prev);
            setValue('otherTypeEquipment', item.typeEquipment)
        }

        if (isOtherTradeMark.length === 0) {
            setIsOtherTradeMarkSelected((prev) => !prev);
            setValue('otherTrademark', item.tradeMark)
        }
        onOpen()
    }

    const handleDelete = (item: TStock) => {
        setStockElementDelete(item)
        onOpenDelete()
    }

    const handleConfirmDelete = async () => {
        try {
            if (stockElementDelete?.uid){
                await deleteStockElement(stockElementDelete.uid)
                openToast('success', "Element deleted successfully", 'Success')
            }
        } catch (error) {
            openToast('error',(error as Error).message, "Error")
        } finally{
            onCloseDelete()
        }
    }

    const handleCreate = handleSubmit(async()=>{
        const create = getValues()
        try {
            const dataToSubmit: TStock = {
                ...create,
                typeEquipment: isOtherTypeSelected ? create.otherTypeEquipment : create.typeEquipment,
                tradeMark: isOtherTradeMarkSelected ? create.otherTrademark : create.otherTrademark,
            }
            if (stockElement?.uid) {
                await updateStockElement(stockElement.uid, dataToSubmit)
                openToast('success', "Element updated successfully", 'Success')
            } else {
                await createNewStockElement(dataToSubmit)
                openToast('success', "New element added to the stock", 'Success')
            }
        } catch (error) {
            openToast('error',(error as Error).message, "Error")
        } finally {
            onClose()
        }
    })

    return {
        handleViewDetails,
        handleEdit,
        handleDelete,
        handleConfirmDelete,
        isOpen,
        isOpenDetail,
        onCloseDetail,
        isOpenDelete,
        stockElement,
        data,
        onOpen,
        onCloseDelete,
        isLoading,
        register,
        errors,
        isSubmitting,
        handleCreate,
        handleChangeTypeEquipment,
        handleChangeTrademark,
        isOtherTypeSelected,
        isOtherTradeMarkSelected,
        handleCancelAdd
    }
}