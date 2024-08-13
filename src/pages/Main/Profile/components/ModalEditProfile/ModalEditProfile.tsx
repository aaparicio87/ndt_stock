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
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { PROFILE_VALIDATION_SCHEMA } from '../../../../../utils/validationSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNotification } from '../../../../../hooks/useNotification'
import { DEGREES } from '../../../../../utils/constants'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FB_STORAGE } from '../../../../../config/firebase.conf'
import { updateStaffElement } from '../../../../../services'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, updateUserData } from '../../../../../state/features/auth/authSlice'
import { AppDispatch } from '../../../../../state/store'
import { capitalizeFirstLetter } from '../../../../../utils/functions'

type TProps = {
    onClose: () => void
    isOpen: boolean
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


const ModalEditProfile = ({ onClose, isOpen }: TProps) => {

    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(selectCurrentUser);

    if (!user) {
        return
    }

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const [selectedImage, setSelectedImage] = React.useState<string | ArrayBuffer | null>(user.photoUrl || null);
    const { openToast } = useNotification()

    const { register, handleSubmit, reset, setValue, getValues, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<TInitialState>({
        defaultValues: INITIAL_STATE,
        resolver: zodResolver(PROFILE_VALIDATION_SCHEMA)
    });

    React.useEffect(() => {
        if (user) {
            reset({
                name: capitalizeFirstLetter(user.name),
                lastName: capitalizeFirstLetter(user.lastName),
                photoUrl: user.photoUrl,
                degree: user.degree
            });
        }

    }, [user]);

    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
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
            if (user?.uid) {
                let updatedData = { ...user, ...data }
                if (url.length > 0) {
                    updatedData = {
                        ...updatedData,
                        photoUrl: url,
                        name: updatedData.name.toLowerCase(),
                        lastName: updatedData.lastName.toLowerCase(),
                    }
                }
                await updateStaffElement(user.uid, updatedData)
                dispatch(updateUserData(updatedData))
                openToast('success', "User profile updated successfully", 'Success')
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
                    <ModalHeader>{"Edit user"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <HStack spacing={4} width="100%" my={4}>
                            <Avatar size="xl" name={`${user.name} ${user.lastName}`} src={selectedImage as string} />
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
                        <Button onClick={onClose} isDisabled={isSubmitting}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </form>

        </Modal>
    )
}

export default ModalEditProfile