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
    Select as ChakraSelect,
    Avatar,
    VStack,
    Text
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNotification } from '../../../../../hooks/useNotification'
import { registerUser, updateStaffElement } from '../../../../../services'
import { DEGREES, ROLES } from '../../../../../utils/constants'
import { Loader, MultiSeleect } from '../../../../../components'
import { Option } from 'chakra-multiselect'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FB_STORAGE } from '../../../../../config/firebase.conf'
import { useUser } from '../../hooks/useUsers'
import { STAFF_VALIDATION_SCHEMA } from '../../../../../utils/validationSchemas'


type TProps = {
    onClose: () => void
    isOpen: boolean
    item: TStaff | undefined
}

type TInitialState = TStaff & {
    profileImage: File | null;
}

const INITIAL_STATE: TInitialState = {
    email: "",
    lastName: "",
    name: "",
    roles: [],
    degree: "",
    photoUrl: "",
    certificates: [],
    profileImage: null
}

const _optionsRoles = ROLES.map((label) => ({ label, value: label.toLowerCase() }))

const ModalAdd = ({ onClose, isOpen, item }: TProps) => {
    const {
        handleGetAllCertificates,
        certificatesList,
    } = useUser()

    const [loading, setLoading] = useState(true)
    const handleItemsState = () => {
        if (item && item.certificates) {
            return item.certificates.map(cert => ({ label: cert.name, value: cert.uid }))
        } else {
            return []
        }
    }

    const handleItemRoles = () => {
        if (item && item.certificates) {
            return item.roles.map(rol => ({ label: rol, value: rol.toLowerCase() }))
        } else {
            return []
        }
    }

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const { openToast } = useNotification()

    const { register, handleSubmit, reset, setValue, getValues, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<TInitialState>({
        defaultValues: INITIAL_STATE,
        resolver: zodResolver(STAFF_VALIDATION_SCHEMA)
    });

    const [itemsCertificates, setItemsCertificates] = React.useState<Option | Option[]>(handleItemsState())
    const [itemsRoles, setItemsRoles] = React.useState<any>(handleItemRoles())
    const [selectedImage, setSelectedImage] = React.useState<string | ArrayBuffer | null>(item?.photoUrl || null);


    const onChangeItemCertificates = (data: Option | Option[]) => {
        setItemsCertificates(data)
        const dataArray = data as Option[]
        const certs = dataArray.map((d) => {
            const certificates: TCertificates = { uid: d.value as string, name: d.label }
            return certificates
        })
        setValue('certificates', certs)
    }

    const onChangeItemRoles = (data: Option | Option[]) => {
        setItemsRoles(data)
        const dataArray = data as Option[]
        const roles = dataArray.map((r) => r.label as TRole)
        setValue('roles', roles)
    }

    React.useEffect(() => {
        handleGetAllCertificates().finally(() => setLoading(false))
        if (item) {
            reset(item);
        } else {
            reset(INITIAL_STATE);
            setItemsCertificates([]);
            setItemsRoles([]);
        }
    }, [item]);

    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
            setItemsCertificates([])
            setItemsRoles([])
            onClose()
        }
    }, [isSubmitSuccessful])

    const onSubmit = async (data: TInitialState) => {
        try {
            const { profileImage } = getValues()
            let url = ""
            if (profileImage && profileImage !== null) {
                const storageRef = ref(FB_STORAGE, `images/${profileImage.name}`);
                const result = await uploadBytes(storageRef, profileImage)
                url = await getDownloadURL(result.ref);
            }
            if (item?.uid) {
                let updatedData = { ...data }
                if (url.length > 0) {
                    updatedData = { ...updatedData, photoUrl: url }
                }
                await updateStaffElement(item.uid, updatedData)
                openToast('success', "User updated successfully", 'Success')

            } else {
                const updatedDataCreate = { ...data, photoUrl: url }
                const response = await registerUser(updatedDataCreate)
                if (response.success) {
                    openToast('success', "New user added to the staff", 'Success')
                } else {
                    openToast('error', response.error ?? 'Internal server Error', "Error")

                }
            }
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
    }

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png'];
            const maxSizeInMB = 2;
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

            if (!validImageTypes.includes(file.type)) {
                openToast('error', 'Only JPG and PNG images are allowed', 'Invalid file type');
                return;
            }

            if (file.size > maxSizeInBytes) {
                openToast('error', `Image size should not exceed ${maxSizeInMB} MB`, 'File too large');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setValue('profileImage', file);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return <Loader />;
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
                        <HStack spacing={4} width="100%" my={4}>
                            <Avatar size="xl" src={selectedImage as string} />
                            <VStack alignItems={'start'} gap={2}>
                                <Text fontSize={'large'} as='b'>Profile Image</Text>
                                <Text fontSize={'small'}> PNG or JPEG</Text>
                                <Button as="label" htmlFor="profile-image" cursor="pointer" size={'sm'}>
                                    Select
                                    <Input
                                        type="file"
                                        id="profile-image"
                                        accept="image/"
                                        onChange={handleImageChange}
                                        display="none"
                                    />
                                </Button>
                            </VStack>
                        </HStack>
                        <HStack spacing={4} py={3}>
                            <FormControl isInvalid={!!errors.name}>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    placeholder='Name'
                                    {...register('name')}
                                />
                                <FormErrorMessage>
                                    {errors.name && errors.name.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.lastName}>
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
                        <HStack spacing={4} py={3}>
                            <FormControl isInvalid={!!errors.email}>
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

                            <FormControl isInvalid={!!errors.degree}>
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

                        <HStack spacing={4} py={3} >
                            <FormControl isInvalid={!!errors.certificates}>
                                <MultiSeleect
                                    options={certificatesList}
                                    value={itemsCertificates}
                                    label='Certificates'
                                    placeholder='Select certificates'
                                    size='md'
                                    onChange={onChangeItemCertificates}
                                />
                                <FormErrorMessage>
                                    {errors.certificates && errors.certificates.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                        <HStack spacing={4} py={4} >
                            <FormControl isInvalid={!!errors.roles}>
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
                        <Button onClick={onClose} isDisabled={isSubmitting}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}

export default ModalAdd