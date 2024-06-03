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
    ModalOverlay
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { STAFF_VALIDATION_SCHEMA } from '../../../../../utils/validationSchemas'
import { useNotification } from '../../../../../hooks/useNotification'
import { registerUser } from '../../../../../services'

type TProps = {
    onClose: () => void
    isOpen: boolean
}

const INITIAL_STATE: TStaff = {
    email: "",
    lastName: "",
    name: "",
    roles: [],
    blueCard: false,
    greenCard: false,
    master: false,
    degree: "",
    photoUrl: "",
    others: [],
}

const ModalAdd = ({ onClose, isOpen }: TProps) => {

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const { openToast } = useNotification()

    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<TStaff>({
        defaultValues: {
            ...INITIAL_STATE
        },
        resolver: zodResolver(STAFF_VALIDATION_SCHEMA)
    });


    React.useEffect(() => {
        reset()
    }, [isSubmitSuccessful])

    const onSubmit = async (data: TStaff) => {
        try {
            await registerUser(data)
            openToast('success', "New user added to the staff", 'Success')
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
        >
            <ModalOverlay />
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalContent>
                    <ModalHeader>Create user</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>

                        <HStack spacing={4} py={4}>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    placeholder='Name'
                                    {...register('name')}
                                />
                                <FormErrorMessage>
                                    {errors.name && errors.name.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Last name</FormLabel>
                                <Input
                                    placeholder='Last name'
                                    {...register('lastName')}
                                />
                                <FormErrorMessage>
                                    {errors.lastName && errors.lastName.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                        <HStack spacing={4} py={4}>
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    placeholder='Email'
                                    {...register('email')}
                                />
                                <FormErrorMessage>
                                    {errors.email && errors.email.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Degree</FormLabel>
                                <Input
                                    placeholder='Degree'
                                    {...register('degree')}
                                />
                                <FormErrorMessage>
                                    {errors.degree && errors.degree.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='teal'
                            variant='solid'
                            mr={3}
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