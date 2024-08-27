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
import { useStaffContext } from '../../../../../context/StaffContext'
import { Loader } from '../../../../../components'
import { CAPITALIZED_ROLES } from '../../../../../utils/constants'


const ELEMENTS_DISPLAY = {
    name: "Name",
    lastName: "Last name",
    email: "Email",
    degree: "Degree",
    certificates: "Certificates",
    roles: "Roles",
}

const formatDataDetail = (key: string, item: TStaff, certificates: string[]) => {
    if (key === 'certificates') {
        if (certificates.length > 0) {
            return certificates.map((cert) => cert).join(', ')
        } else {
            return '-'
        }
    } else if (key === 'roles') {
        let roles = item[key as keyof TStaff] as TRole[] | undefined
        if (roles)
            return roles.map((role) => CAPITALIZED_ROLES[role]).join(', ')
        else return '-'
    } else if (key === 'name' || key === 'lastName') {
        return capitalizeFirstLetter(item[key as keyof TStaff]?.toString() ?? '')
    } else {
        return item[key as keyof TStaff]?.toString() ?? '-'
    }
}

const DetailModal = () => {

    const {
        staffElement,
        isOpenDetail,
        closeModalAdd,
        certificatesDetails,
        isLoading,
    } = useStaffContext()

    return (
        <Modal isOpen={isOpenDetail} onClose={closeModalAdd}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Staff element detail</ModalHeader>
                <ModalCloseButton />
                {!isLoading ?
                    <>
                        <ModalBody>
                            {staffElement ? (
                                <Stack spacing={4}>
                                    {Object.entries(ELEMENTS_DISPLAY).map(([key, label]) => (
                                        <Box key={key}>
                                            <strong>{label}:</strong> <Text>{formatDataDetail(key, staffElement, certificatesDetails)}</Text>
                                            <Divider mt={2} />
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Box>No item selected</Box>
                            )}
                        </ModalBody>
                    </> :
                    <Loader />
                }
                <ModalFooter>
                    <Button colorScheme="blue" onClick={closeModalAdd}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DetailModal