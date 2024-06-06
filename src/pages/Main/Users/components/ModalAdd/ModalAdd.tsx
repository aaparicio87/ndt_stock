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
import { registerUser, updateStaffElement } from '../../../../../services'
import { CERTIFICATES, DEGREES, ROLES } from '../../../../../utils/constants'
import { MultiSeleect } from '../../../../../components'
import { Option } from 'chakra-multiselect'


type TProps = {
    onClose: () => void
    isOpen: boolean
    item: TStaff | undefined
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

const ModalAdd = ({ onClose, isOpen, item }: TProps) => {

    const handleItemsState = () => {
        if (item && item.cerificates) {
            return item.cerificates.map(cert => ({ label: cert, value: cert.toLowerCase() }))
        } else {
            return []
        }
    }

    const handleItemRoles = () => {
        if (item && item.cerificates) {
            return item.roles.map(rol => ({ label: rol, value: rol.toLowerCase() }))
        } else {
            return []
        }
    }

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const { openToast } = useNotification()

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<TStaff>({
        defaultValues: INITIAL_STATE,
        resolver: zodResolver(STAFF_VALIDATION_SCHEMA)
    });

    const [itemsCertificates, setItemsCertificates] = React.useState<Option | Option[]>(handleItemsState())
    const [itemsRoles, setItemsRoles] = React.useState<any>(handleItemRoles())

    const onChangeItemCertificates = (data: Option | Option[]) => {
        setItemsCertificates(data)
        const dataArray = data as Option[]
        const certificates = dataArray.map((d) => d.label as TCertificates)
        setValue('cerificates', certificates)
    }

    const onChangeItemRoles = (data: Option | Option[]) => {
        setItemsRoles(data)
        const dataArray = data as Option[]
        const roles = dataArray.map((r) => r.label as TRole)
        setValue('roles', roles)
    }

    React.useEffect(() => {
        if (item) {
            reset(item);
        } else {
            reset(INITIAL_STATE);
            setItemsCertificates([]);
            setItemsRoles([]);
        }
    }, [item]);

    React.useEffect(() => {
        reset()
        setItemsCertificates([])
        setItemsRoles([])
    }, [isSubmitSuccessful])

    const onSubmit = async (data: TStaff) => {
        try {
            if (item?.uid) {
                await updateStaffElement(item.uid, data)
                openToast('success', "User updated successfully", 'Success')
            } else {
                const response = await registerUser(data)
                if (response.success) {
                    openToast('success', "New user added to the staff", 'Success')
                } else {
                    openToast('error', response.error ?? 'Internal server Error', "Error")

                }
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
                    <ModalHeader>{item ? "Edit user" : "Create user"}</ModalHeader>
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
                                    isDisabled={!!item?.email}
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
                                <FormErrorMessage>
                                    {errors.cerificates && errors.cerificates.message}
                                </FormErrorMessage>
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
                                <FormErrorMessage>
                                    {errors.roles && errors.roles.message}
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
                            type='submit'
                        >
                            {item ? "Update" : "Save"}
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}

export default ModalAdd