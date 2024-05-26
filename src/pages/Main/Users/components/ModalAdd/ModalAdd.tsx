import {
    Button,
    FormControl,
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
import React from 'react'

type TProps = {
    onClose: () => void
    isOpen: boolean
}

const ModalAdd = ({ onClose, isOpen }: TProps) => {

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
            size={'xl'}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create user</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>

                    <HStack spacing={4} py={4}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input ref={initialRef} placeholder='Name' />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Last name</FormLabel>
                            <Input placeholder='Last name' />
                        </FormControl>
                    </HStack>
                    <HStack spacing={4} py={4}>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input placeholder='Email' />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Degree</FormLabel>
                            <Input placeholder='Degree' />
                        </FormControl>
                    </HStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme='teal'
                        variant='solid'
                        mr={3}
                    >
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalAdd