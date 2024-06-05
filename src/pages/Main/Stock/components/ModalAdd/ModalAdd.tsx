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
import React from 'react'
import { useForm } from 'react-hook-form'
import { STOCK_VALIDATION_SCHEMA } from '../../../../../utils/validationSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { createNewStockElement } from '../../../../../services'
import { QOS, TRADEMARK, TYPE_EQUIPMENTS } from '../../../../../utils/constants'
import { useNotification } from '../../../../../hooks/useNotification'

type TProps = {
    onClose: () => void
    isOpen: boolean
}

const INITIAL_STATE: TStock = {
    serialNumber: "",
    model: "",
    typeEquipment: "",
    tradeMark: "",
    store: "",
    calibrationDate: "",
    qualityOfService: "",
    remarks: "",
}

const ModalAdd = ({ onClose, isOpen }: TProps) => {

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const { openToast } = useNotification()

    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<TStock>({
        defaultValues: {
            ...INITIAL_STATE
        },
        resolver: zodResolver(STOCK_VALIDATION_SCHEMA)
    });

    React.useEffect(() => {
        reset()
    }, [isSubmitSuccessful])


    const onSubmit = async (data: TStock) => {
        try {
            await createNewStockElement(data)
            openToast('success', "New element added to the stock", 'Success')
            onClose()
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
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
                    <ModalHeader>Create product</ModalHeader>
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
                                >
                                    {
                                        TYPE_EQUIPMENTS.map((type, index) => (
                                            <option value={type} key={index}>{type}</option>
                                        ))
                                    }
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
                                >
                                    {
                                        TRADEMARK.map((type, index) => (
                                            <option value={type} key={index}>{type}</option>
                                        ))
                                    }
                                </Select>
                                <FormErrorMessage>
                                    {errors.tradeMark && errors.tradeMark.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
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
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}

export default ModalAdd