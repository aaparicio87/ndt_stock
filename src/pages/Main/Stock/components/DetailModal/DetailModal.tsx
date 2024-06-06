import {
    Box,
    Button,
    Divider,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
} from '@chakra-ui/react'

type TProps = {
    onClose: () => void
    isOpen: boolean
    item: TStock
}

const ELEMENTS_DISPLAY = {
    serialNumber: "Serial number",
    model: "Model",
    typeEquipment: "Type of equipment",
    tradeMark: "Trademark",
    store: "Store",
    calibrationDate: "Calibration date",
    qualityOfService: "QoS",
    remarks: "Remarks",
}

const DetailModal = ({ isOpen, onClose, item }: TProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Element detail</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {item ? (
                        <Stack spacing={4}>
                            {Object.entries(ELEMENTS_DISPLAY).map(([key, label]) => (
                                <Box key={key}>
                                    <strong>{label}:</strong> {item[key as keyof TStock]}
                                    <Divider mt={2} />
                                </Box>
                            ))}
                        </Stack>
                    ) : (
                        <Box>No item selected</Box>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={onClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DetailModal