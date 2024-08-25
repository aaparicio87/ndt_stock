import React, { useState } from "react"
import { useDisclosure } from "@chakra-ui/react"
import { useNotification } from "../../../../hooks/useNotification"
import { addCertificate, deleteCertificateElement, getAllCertificates, updateCertificateElement } from "../../../../services"
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form"
import { collection, onSnapshot } from "firebase/firestore"
import { FB_DB } from "../../../../config/firebase.conf"
import { CERTIFICATE, LEVELS } from "../../../../utils/constants"
import { MultiValue } from "react-select"

type TInitialState = {
    name: string
    description: string
    levels: ILevel[]
}


const INITIAL_STATE: TInitialState = {
    name: '',
    description: '',
    levels: []
}

const levelsCert = LEVELS.map((label) => ({ label: label, value: label.toLowerCase().replace(" ", "_") }))

export interface IUsecertificates {
    data: TCertificates[]
    isLoading: boolean
    isOpenDelete: boolean
    isOpen: boolean
    handleConfirmDelete: () => Promise<void>
    handleDelete: (cert: TCertificates) => void
    register: UseFormRegister<TInitialState>
    errors: FieldErrors<TCertificates>
    isSubmitting: boolean
    certificate: TCertificates | undefined
    handleEdit: (cert: TCertificates) => void
    handleSubmitCertificate: (e?: React.BaseSyntheticEvent) => Promise<void>
    onCloseEdit: () => void
    onCloseDeleteDialog: () => void
    onOpen: () => void
    levelsCert: TOptions[]
    onChangeLevels: (data: MultiValue<TOptions>) => void
    itemsLevelCert: MultiValue<TOptions>
}

export const useCertificates = (): IUsecertificates => {
    const { openToast } = useNotification()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [data, setData] = React.useState<TCertificates[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const certificateRef = React.useRef<string | undefined>(undefined)
    const [certificate, setCertificate] = React.useState<TCertificates | undefined>(undefined)
    const [itemsLevelCert, setItemsLevelCert] = useState<MultiValue<TOptions>>([])

    const {
        register,
        getValues,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<TInitialState>({
        defaultValues: INITIAL_STATE
    });


    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(FB_DB, CERTIFICATE), (_) => {
            handleGetAllCertificates()
        })
        return () => unsubscribe();

    }, [])

    React.useEffect(() => {
        reset()
    }, [isSubmitSuccessful])


    const handleGetAllCertificates = async () => {
        setIsLoading((prev) => !prev)
        try {
            const certificates = await getAllCertificates()
            if (certificates) {
                setData(certificates)
            }
        } catch (error) {
            openToast('error', `Error fetching staff: ${(error as Error).message}`, "Error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (cert: TCertificates) => {
        reset(cert)
        setCertificate(cert)
        const levels = cert.levels.map((level) => ({ label: level.name, value: level.uid }))
        setItemsLevelCert(levels)
        onOpen()
    }

    const onCloseEdit = () => {
        if (certificate) {
            setCertificate(undefined)
            reset(INITIAL_STATE)
        }
        setItemsLevelCert([])
        onClose()
    }

    const handleDelete = (cert: TCertificates) => {
        if (cert.uid) {
            certificateRef.current = cert.uid
            onOpenDelete()
        }
    }

    const handleConfirmDelete = async () => {
        try {
            if (certificateRef.current)
                await deleteCertificateElement(certificateRef.current)
            onCloseDelete()
            openToast('success', "Element deleted successfully", 'Success')
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
    }

    const onCloseDeleteDialog = () => {
        certificateRef.current = undefined
        onCloseDelete()
    }

    const handleSubmitCertificate = handleSubmit(async () => {
        setIsLoading((prev) => !prev)
        const { description, name, levels } = getValues()
        try {

            if (certificate && certificate.uid) {
                await updateCertificateElement(certificate.uid, { name, description, levels })
                openToast('success', "Element updated successfully", 'Success')
            } else {
                await addCertificate({ name, description, levels })
                openToast('success', "New certificate created", 'Success')
            }
        } catch (error) {
            openToast('error', (error as Error).message, "Error")
        } finally {
            if (certificate) {
                setCertificate(undefined)

            }
            setItemsLevelCert([])
            onClose()
            setIsLoading(false)
        }
    })

    const onChangeLevels = (data: MultiValue<TOptions>) => {
        setItemsLevelCert(data)
        const certs = data.map((d) => {
            const levels: ILevel = { uid: d.value as TLevelKey, name: d.label as TLevel }
            return levels
        })
        setValue('levels', certs)
    }


    return {
        data,
        isLoading,
        isOpenDelete,
        isOpen,
        handleConfirmDelete,
        handleDelete,
        register,
        errors,
        isSubmitting,
        certificate,
        handleEdit,
        handleSubmitCertificate,
        onCloseEdit,
        onCloseDeleteDialog,
        onOpen,
        levelsCert,
        onChangeLevels,
        itemsLevelCert
    }
}