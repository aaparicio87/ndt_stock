import React from 'react'
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
import { DEGREES, ROLES } from '../../../../../utils/constants'
import { Loader, MultiSelect } from '../../../../../components'
import { useStaffContext } from '../../../../../context/StaffContext'


const _optionsRoles = ROLES.map((label) => ({ label, value: label.toLowerCase() }))

const ModalAdd = () => {

    const {
        certificatesList,
        loading,
        onSubmitUser,
        selectedImage,
        handleImageChange,
        register,
        errors,
        itemsCertificates,
        itemsRoles,
        isSubmitting,
        onChangeItemCertificates,
        onChangeItemRoles,
        isOpen,
        closeModalAdd,
        staffElement
    } = useStaffContext()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={closeModalAdd}
            size={'xl'}
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <form onSubmit={onSubmitUser}>
                <ModalContent>
                    <ModalHeader>{staffElement ? "Edit user" : "Create user"}</ModalHeader>
                    <ModalCloseButton />
                    {!loading ?
                        <>
                            <ModalBody>
                                <HStack spacing={4} width="100%" my={4}>
                                    <Avatar size="xl" src={selectedImage as string} />
                                    <VStack alignItems={'start'} gap={2}>
                                        <Text fontSize={'large'} as='b'>Profile Image</Text>
                                        <Text fontSize={'small'}> PNG or JPEG</Text>
                                        <Button
                                            as="label"
                                            htmlFor="profile-image"
                                            cursor="pointer"
                                            size={'sm'}
                                            isDisabled={isSubmitting}
                                        >
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

                                <HStack spacing={4} py={2}>
                                    <FormControl isInvalid={!!errors.name} isDisabled={isSubmitting}>
                                        <FormLabel>Name</FormLabel>
                                        <Input
                                            placeholder='Name'
                                            {...register('name')}
                                        />
                                        <FormErrorMessage>
                                            {errors.name && errors.name.message}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.lastName} isDisabled={isSubmitting}>
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

                                <HStack spacing={4} py={2}>
                                    <FormControl isInvalid={!!errors.email} isDisabled={isSubmitting}>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            placeholder='Email'
                                            {...register('email')}
                                            isDisabled={!!staffElement?.email}
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
                                    <FormControl isInvalid={!!errors.certificates} isDisabled={isSubmitting}>
                                        <FormLabel>Certificates</FormLabel>
                                        <MultiSelect
                                            options={certificatesList}
                                            value={itemsCertificates}
                                            onChange={onChangeItemCertificates}
                                            menuPlacement='auto'
                                        />
                                        <FormErrorMessage>
                                            {errors.certificates && errors.certificates.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                </HStack>

                                <HStack spacing={4} py={3} >
                                    <FormControl isInvalid={!!errors.roles} isDisabled={isSubmitting}>
                                        <FormLabel>Roles</FormLabel>
                                        <MultiSelect
                                            options={_optionsRoles}
                                            value={itemsRoles}
                                            onChange={onChangeItemRoles}
                                            menuPlacement='auto'
                                        />
                                        <FormErrorMessage>
                                            {errors.roles && errors.roles.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                </HStack>
                            </ModalBody>
                        </> :
                        <Loader />
                    }
                    <ModalFooter>
                        <Button
                            colorScheme='teal'
                            variant='solid'
                            mr={3}
                            isLoading={isSubmitting}
                            type='submit'
                        >
                            {staffElement ? "Update" : "Save"}
                        </Button>
                        <Button onClick={closeModalAdd} isDisabled={isSubmitting}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}

export default ModalAdd
