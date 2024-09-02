import React from "react"
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack
} from "@chakra-ui/react"
import { useCertificatesContext } from "../../../../../context/CertificatesContext"
import { MultiSelect } from "../../../../../components"




const ModalAdd = () => {

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const {
        isOpen,
        onCloseEdit,
        handleSubmitCertificate,
        certificate,
        errors,
        register,
        isSubmitting,
        levelsCert,
        onChangeLevels,
        itemsLevelCert,
        clearErrors
    } = useCertificatesContext()

    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onCloseEdit}
            size={'lg'}
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <form onSubmit={handleSubmitCertificate}>
                <ModalContent>
                    <ModalHeader>{certificate ? "Edit certificate" : "Create certificate"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={4}>
                        <VStack spacing={4} >
                            <FormControl isInvalid={!!errors.name}>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    placeholder='Name'
                                    {...register('name', {
                                        required: 'This field is required',
                                        pattern: {
                                            value: /^[a-zA-Z0-9]+$/,
                                            message: 'Name must only contain letters and numbers'
                                        }
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.name && errors.name.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.levels}>
                                <FormLabel>Levels</FormLabel>
                                <MultiSelect
                                    options={levelsCert}
                                    value={itemsLevelCert}
                                    onChange={onChangeLevels}
                                    handleFocus={() => errors.levels && clearErrors('levels')}
                                />
                                <FormErrorMessage>
                                    {errors.levels && errors.levels.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl >
                                <FormLabel>Description</FormLabel>
                                <Input
                                    placeholder='Description'
                                    {...register('description')}
                                />
                                <FormErrorMessage>
                                    {errors.description && errors.description.message}
                                </FormErrorMessage>
                            </FormControl>
                        </VStack>

                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='teal'
                            variant='solid'
                            mr={3}
                            isLoading={isSubmitting}
                            type='submit'
                        >
                            {certificate ? "Update" : "Save"}
                        </Button>
                        <Button onClick={onCloseEdit} isDisabled={isSubmitting}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}

export default ModalAdd