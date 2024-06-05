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
    Select as ChakraSelect
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { STAFF_VALIDATION_SCHEMA } from '../../../../../utils/validationSchemas'
import { useNotification } from '../../../../../hooks/useNotification'
import { registerUser } from '../../../../../services'
import { CERTIFICATES, DEGREES, ROLES } from '../../../../../utils/constants'
import { MultiSeleect } from '../../../../../components'
import { Option, SelectOnChange } from 'chakra-multiselect'


type TProps = {
    onClose: () => void
    isOpen: boolean
}

const INITIAL_STATE: TStaff = {
    email: "",
    lastName: "",
    name: "",
    roles: [],
    degree: "",
    photoUrl: "",
    cerificates: []
}


const _optionsCertificates = CERTIFICATES.map((label) => ({ label, value: label.toLowerCase() }))
const _optionsRoles = ROLES.map((label) => ({ label, value: label.toLowerCase() }))

const ModalAdd = ({ onClose, isOpen }: TProps) => {

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const { openToast } = useNotification()

    const { register, handleSubmit, reset, setValue, getValues, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<TStaff>({
        defaultValues: {
            ...INITIAL_STATE
        },
        resolver: zodResolver(STAFF_VALIDATION_SCHEMA)
    });
    const [itemsCertificates, setItemsCertificates] = React.useState<Option | Option[]>([])
    const [itemsRoles, setItemsRoles] = React.useState<any>([])

    const onChangeItemCertificates = (data: Option | Option[]) => {
        setItemsCertificates(data)
        const dataArray = data as Option[]
        const certificates = dataArray

        console.log(data)
        /* let cert: TCertificates[] = getValues().cerificates ?? []

        if (typeof data === 'object') {
            let tempData = data as Option
            let singleCert = tempData.label as TCertificates
            cert = [...cert, singleCert]
            setValue('cerificates', cert)
        } else {
            let tempData = data as Option[]
            tempData.forEach((tmp) => {
                let singleCert = tmp.label as TCertificates
                cert = [...cert, singleCert]
                setValue('cerificates', cert)
            })
        } */

    }

    const onChangeItemRoles = (data: Option | Option[]) => {
        setItemsRoles(data)
        console.log(data)
        /* let roles: TRole[] = getValues().roles ?? []

        if (typeof data === 'object') {
            let tempData = data as Option
            let singleRole = tempData.label as TRole
            roles = [...roles, singleRole]
            setValue('roles', roles)
        } else {
            let tempData = data as Option[]
            tempData.forEach((tmp) => {
                let singleRole = tmp.label as TRole
                roles = [...roles, singleRole]
                setValue('roles', roles)
            })
        } */
    }


    React.useEffect(() => {
        reset()
        setItemsCertificates([])
        setItemsRoles([])
    }, [isSubmitSuccessful])

    const onSubmit = async (data: TStaff) => {
        try {
            console.log(data)
            await registerUser(data)
            openToast('success', "New user added to the staff", 'Success')
            onClose()
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
    }

    console.log(errors, getValues())

    console.log(itemsCertificates, 'itemsCertificates')
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
                                <ChakraSelect
                                    placeholder='Select degree'
                                    {...register('degree')}
                                >
                                    {
                                        DEGREES.map((type, index) => (
                                            <option value={type} key={index}>{type}</option>
                                        ))
                                    }
                                </ChakraSelect>
                                <FormErrorMessage>
                                    {errors.degree && errors.degree.message}
                                </FormErrorMessage>
                                <FormErrorMessage>
                                    {errors.degree && errors.degree.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>

                        <HStack spacing={4} py={4} >
                            <FormControl>
                                <MultiSeleect
                                    options={_optionsCertificates}
                                    value={itemsCertificates}
                                    label='Certificates'
                                    placeholder='Select certificates'
                                    size='md'
                                    onChange={onChangeItemCertificates}
                                />

                            </FormControl>
                        </HStack>
                        <HStack spacing={4} py={4} >
                            <FormControl>
                                <MultiSeleect
                                    options={_optionsRoles}
                                    value={itemsRoles}
                                    label='Roles'
                                    placeholder='Select roles'
                                    size='md'
                                    onChange={onChangeItemRoles}
                                />
                            </FormControl>
                        </HStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='teal'
                            variant='solid'
                            mr={3}
                            isLoading={isSubmitting}
                            type='submit'
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