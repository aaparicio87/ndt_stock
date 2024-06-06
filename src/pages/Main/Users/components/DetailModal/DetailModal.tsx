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
    item: TStaff
}

const ELEMENTS_DISPLAY = {
    name: "Name",
    lastName: "Last name",
    email: "Email",
    degree: "Degree",
    cerificates: "Certificates",
    roles: "Roles",
}

const formatDataDetail = (key: string, item: TStaff) => {
    if (key === 'cerificates') {
        let certificates = item[key as keyof TStaff] as TCertificates[] | undefined
        if (certificates)
            return certificates.join(', ')
        else return '-'
    } else if (key === 'roles') {
        let roles = item[key as keyof TStaff] as TRole[] | undefined
        if (roles)
            return roles.join(', ')
        else return '-'
    } else {
        return item[key as keyof TStaff] ?? '-'
    }
}

const DetailModal = ({ isOpen, onClose, item }: TProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Staff element detail</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {item ? (
                        <Stack spacing={4}>
                            {Object.entries(ELEMENTS_DISPLAY).map(([key, label]) => (
                                <Box key={key}>
                                    <strong>{label}:</strong> {formatDataDetail(key, item)}
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