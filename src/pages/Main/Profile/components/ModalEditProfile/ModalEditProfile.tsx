import React, { ChangeEvent } from 'react'
import {
    Avatar, Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    VStack,
    Select as ChakraSelect,
    ModalFooter,
    Box,
    IconButton,
} from '@chakra-ui/react'
import { FiTrash2 } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { PROFILE_VALIDATION_SCHEMA } from '../../../../../utils/validationSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNotification } from '../../../../../hooks/useNotification'
import { DEGREES } from '../../../../../utils/constants'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FB_STORAGE } from '../../../../../config/firebase.conf'
import { getStaffInformationByUserUID, updateStaffElement } from '../../../../../services'
import { useDispatch } from 'react-redux'
import { updateUserData } from '../../../../../state/features/auth/authSlice'
import { AppDispatch } from '../../../../../state/store'
import { capitalizeFirstLetter } from '../../../../../utils/functions'

type TProps = {
    onClose: () => void
    isOpen: boolean
    user: TStaff
}

type TInitialState = Partial<TStaff> & {
    profileImage: File | null;

}

const INITIAL_STATE: TInitialState = {
    name: "",
    lastName: "",
    photoUrl: "",
    degree: "",
    profileImage: null
}


const ModalEditProfile = ({ onClose, isOpen, user }: TProps) => {

    const dispatch: AppDispatch = useDispatch();

    const image = user.photoUrl ?? null

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [selectedImage, setSelectedImage] = React.useState<string | ArrayBuffer | null>(image);
    const { openToast } = useNotification()

    const { register, handleSubmit, reset, setValue, getValues, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<TInitialState>({
        defaultValues: INITIAL_STATE,
        resolver: zodResolver(PROFILE_VALIDATION_SCHEMA)
    });

    React.useEffect(() => {
        reset({
            name: capitalizeFirstLetter(user.name),
            lastName: capitalizeFirstLetter(user.lastName),
            photoUrl: user.photoUrl,
            degree: user.degree
        });
    }, [user]);

    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
            handleCloseModal()
        }
    }, [isSubmitSuccessful])

    const handleCloseModal = () => {
        onClose()
        setSelectedImage(image)
        reset()
    }

    const onSubmit = async (data: TInitialState) => {
        try {
            const { profileImage } = getValues()
            let url: string | undefined = undefined;

            if (profileImage && profileImage !== null) {
                const storageRef = ref(FB_STORAGE, `images/${profileImage.name}`);
                const result = await uploadBytes(storageRef, profileImage)
                url = await getDownloadURL(result.ref);
            }
            if (user?.uid) {
                const staff = await getStaffInformationByUserUID(user?.uid);
                let { profileImage, ...updatedData } = { ...data };
                if (staff !== null) {
                    const staffUpdate = {
                        ...staff,
                        photoUrl: url ?? "",
                        name: updatedData.name ? updatedData.name.toLowerCase() : staff.name,
                        lastName: updatedData.lastName ? updatedData.lastName?.toLowerCase() : staff.lastName,
                    }
                    await updateStaffElement(user.uid, staffUpdate)
                    dispatch(updateUserData(staffUpdate))
                    openToast('success', "User profile updated successfully", 'Success')
                } else {
                    openToast('error', "An error occurs when update the profile", "Error")
                }
            }
        } catch (error) {
            openToast('error', (error as Error).message, "Error")
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

    const handleClearImage = () => {
        setSelectedImage(null);
        setValue("profileImage", null);
    }

    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={handleCloseModal}
            size={'xl'}
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalContent>
                    <ModalHeader>{"Edit user"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <HStack spacing={4} width="100%" my={4}>
                            {
                                selectedImage === null ?
                                    <Avatar bg='teal.500' size={'xl'} /> :
                                    <Box position="relative" display="inline-block">
                                        <Avatar bg='teal.500' size={'xl'} src={selectedImage as string} />
                                        <IconButton
                                            aria-label="Delete image"
                                            icon={<FiTrash2 />}
                                            size="sm"
                                            position="absolute"
                                            right="0"
                                            bottom="0"
                                            zIndex="1"
                                            onClick={handleClearImage}
                                        />
                                    </Box>
                            }
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
                        <Stack alignItems={'start'} gap={2}>
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
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme='teal'
                            variant='solid'
                            mr={3}
                            isLoading={isSubmitting}
                            type='submit'
                        >
                            Update
                        </Button>
                        <Button onClick={handleCloseModal} isDisabled={isSubmitting}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </form>

        </Modal>
    )
}

export default ModalEditProfile