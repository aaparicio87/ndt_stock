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
import { useStockContext } from '../../../../../context/StockContext'


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

const DetailModal = () => {

    const {
        isOpenDetail: isOpen,
        closeDetails,
        stockElement: item,
    } = useStockContext()

    return (
        <Modal isOpen={isOpen} onClose={closeDetails}>
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
                    <Button colorScheme="teal" onClick={closeDetails}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DetailModal