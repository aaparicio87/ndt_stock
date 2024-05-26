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
    ModalOverlay,
    Select
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
                <ModalHeader>Create product</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>

                    <HStack spacing={4} py={4}>
                        <FormControl>
                            <FormLabel>Serial number</FormLabel>
                            <Input ref={initialRef} placeholder='Serial number' />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Modal</FormLabel>
                            <Input placeholder='Modal' />
                        </FormControl>
                    </HStack>
                    <HStack spacing={4} py={4}>
                        <FormControl>
                            <FormLabel>Type of equipment</FormLabel>
                            <Select placeholder='Select option'>
                                <option value='option1'>Option 1</option>
                                <option value='option2'>Option 2</option>
                                <option value='option3'>Option 3</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Trademark</FormLabel>
                            <Select placeholder='Select option'>
                                <option value='option1'>Option 1</option>
                                <option value='option2'>Option 2</option>
                                <option value='option3'>Option 3</option>
                            </Select>
                        </FormControl>
                    </HStack>
                    <HStack spacing={4} py={4}>
                        <FormControl>
                            <FormLabel>Store</FormLabel>
                            <Input ref={initialRef} placeholder='Store' />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Calibration</FormLabel>
                            <Input placeholder='Select Date and Time' size='md' type='date' />
                        </FormControl>
                    </HStack>
                    <HStack spacing={4} py={4}>
                        <FormControl>
                            <FormLabel>QoS</FormLabel>
                            <Select placeholder='Select option'>
                                <option value='option1'>Good</option>
                                <option value='option2'>Regular</option>
                                <option value='option3'>Bad</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Remarks</FormLabel>
                            <Input ref={initialRef} placeholder='Remarks' />
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