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
    Text,
} from '@chakra-ui/react'
import { capitalizeFirstLetter } from '../../../../../utils/functions'

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
    certificates: "Certificates",
    roles: "Roles",
}

const formatDataDetail = (key: string, item: TStaff) => {
    if (key === 'certificates') {
        let certificates = item[key as keyof TStaff] as TCertificates[]
        if (certificates) {
            return certificates.map((cert) => cert.name).join(', ')
        } else {
            return '-'
        }
    } else if (key === 'roles') {
        let roles = item[key as keyof TStaff] as TRole[] | undefined
        if (roles)
            return roles.join(', ')
        else return '-'
    } else if (key === 'name' || key === 'lastName') {
        return capitalizeFirstLetter(item[key as keyof TStaff]?.toString() ?? '')
    } else {
        return item[key as keyof TStaff]?.toString() ?? '-'
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
                                    <strong>{label}:</strong> <Text>{formatDataDetail(key, item)}</Text>
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