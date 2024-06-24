import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select
} from '@chakra-ui/react'
import React, { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { STOCK_VALIDATION_SCHEMA } from '../../../../../utils/validationSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { createNewStockElement, updateStockElement } from '../../../../../services'
import { QOS, TRADEMARK, TYPE_EQUIPMENTS } from '../../../../../utils/constants'
import { useNotification } from '../../../../../hooks/useNotification'

type TProps = {
    onClose: () => void
    isOpen: boolean
    item: TStock | undefined
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
    calibrationDate: "",
    qualityOfService: "",
    remarks: "",
    otherTypeEquipment: "",
    otherTrademark: "",
}

const ModalAdd = ({ onClose, isOpen, item }: TProps) => {

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const { openToast } = useNotification()
    const [isOtherTypeSelected, setIsOtherTypeSelected] = React.useState(false);
    const [isOtherTradeMarkSelected, setIsOtherTradeMarkSelected] = React.useState(false);

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<TInitialState>({
        defaultValues: INITIAL_STATE,
        resolver: zodResolver(STOCK_VALIDATION_SCHEMA)
    });

    React.useEffect(() => {
        if (item) {
            reset(item);
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
        } else {
            reset(INITIAL_STATE);
        }
    }, [item]);

    React.useEffect(() => {
        reset(INITIAL_STATE)
        setIsOtherTypeSelected(false)
        setIsOtherTradeMarkSelected(false)
    }, [isSubmitSuccessful])

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

    const onSubmit = async (data: TInitialState) => {
        try {
            const dataToSubmit: TStock = {
                ...data,
                typeEquipment: isOtherTypeSelected ? data.otherTypeEquipment : data.typeEquipment,
                tradeMark: isOtherTradeMarkSelected ? data.otherTrademark : data.otherTrademark,
            }
            if (item?.uid) {
                await updateStockElement(item.uid, dataToSubmit)
                openToast('success', "Element updated successfully", 'Success')
            } else {
                await createNewStockElement(dataToSubmit)
                openToast('success', "New element added to the stock", 'Success')
            }

        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        } finally {
            onClose()
        }
    }

    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
            size={'xl'}
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalContent>
                    <ModalHeader>{item ? "Edit product" : "Create product"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>

                        <HStack spacing={4} py={4}>
                            <FormControl>
                                <FormLabel>Serial number</FormLabel>
                                <Input
                                    placeholder='Serial number'
                                    {...register('serialNumber')}
                                />
                                <FormErrorMessage>
                                    {errors.serialNumber && errors.serialNumber.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Model</FormLabel>
                                <Input
                                    placeholder='Model'
                                    {...register('model')}
                                />
                                <FormErrorMessage>
                                    {errors.model && errors.model.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                        <HStack spacing={4} py={4}>
                            <FormControl>
                                <FormLabel>Type of equipment</FormLabel>
                                <Select
                                    placeholder='Select option'
                                    {...register('typeEquipment')}
                                    onChange={handleChangeTypeEquipment}
                                    defaultValue={isOtherTypeSelected ? 'others' : undefined}
                                >
                                    {
                                        TYPE_EQUIPMENTS.map((type, index) => (
                                            <option value={type} key={index}>{type}</option>
                                        ))
                                    }
                                    <option value='others'>Other</option>
                                </Select>
                                <FormErrorMessage>
                                    {errors.typeEquipment && errors.typeEquipment.message}
                                </FormErrorMessage>
                            </FormControl>



                            <FormControl>
                                <FormLabel>Trademark</FormLabel>
                                <Select
                                    placeholder='Select option'
                                    {...register('tradeMark')}
                                    onChange={handleChangeTrademark}
                                    defaultValue={isOtherTradeMarkSelected ? 'others' : undefined}
                                >
                                    {
                                        TRADEMARK.map((type, index) => (
                                            <option value={type} key={index}>{type}</option>
                                        ))
                                    }
                                    <option value='others'>Other</option>
                                </Select>

                                <FormErrorMessage>
                                    {errors.otherTrademark && errors.otherTrademark.message}
                                    {errors.tradeMark && errors.tradeMark.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                        {
                            (isOtherTypeSelected ||
                                isOtherTradeMarkSelected) &&
                            <HStack spacing={4} py={1} width={'100%'} flex={1}>
                                {isOtherTypeSelected && (
                                    <FormControl w={'50%'}>
                                        <Input
                                            placeholder='Other type of equipment'
                                            {...register('otherTypeEquipment')}
                                        />
                                        <FormErrorMessage>
                                            {errors.otherTypeEquipment && errors.otherTypeEquipment.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                )}

                                {isOtherTradeMarkSelected && (
                                    <FormControl w={'50%'} ml={isOtherTradeMarkSelected ? 'auto' : '0'}>
                                        <Input
                                            placeholder='Other trademark'
                                            {...register('otherTrademark')}
                                        />
                                    </FormControl>
                                )}
                            </HStack>
                        }
                        <HStack spacing={4} py={4}>
                            <FormControl>
                                <FormLabel>Store</FormLabel>
                                <Input
                                    placeholder='Store'
                                    {...register('store')}
                                />
                                <FormErrorMessage>
                                    {errors.store && errors.store.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Calibration</FormLabel>
                                <Input
                                    placeholder='Select Date and Time'
                                    size='md'
                                    type='date'
                                    {...register('calibrationDate')}
                                />
                                <FormErrorMessage>
                                    {errors.calibrationDate && errors.calibrationDate.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                        <HStack spacing={4} py={4}>
                            <FormControl>
                                <FormLabel>QoS</FormLabel>
                                <Select
                                    placeholder='Select option'
                                    {...register("qualityOfService")}
                                >
                                    {
                                        QOS.map((type, index) => (
                                            <option value={type} key={index}>{type}</option>
                                        ))
                                    }
                                </Select>
                                <FormErrorMessage>
                                    {errors.qualityOfService && errors.qualityOfService.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Remarks</FormLabel>
                                <Input
                                    placeholder='Remarks'
                                    {...register('remarks')}
                                />
                                <FormErrorMessage>
                                    {errors.remarks && errors.remarks.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='teal'
                            variant='solid'
                            mr={3}
                            type='submit'
                            isLoading={isSubmitting}
                        >
                            {item ? "Update" : "Save"}
                        </Button>
                        <Button onClick={onClose} isDisabled={isSubmitting}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}

export default ModalAdd