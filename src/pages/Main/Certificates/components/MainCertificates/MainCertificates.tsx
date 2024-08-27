import { Box, Button, Stack } from "@chakra-ui/react"
import { DeleteDialog, HeaderViewTable } from "../../../../../components"
import { FiPlus } from "react-icons/fi"
import CertificatesList from "../CertificatesList/CertificatesList"
import ModalAdd from "../ModalAdd/ModalAdd"
import { useCertificatesContext } from "../../../../../context/CertificatesContext"


const MainCertificates = () => {

    const {
        handleConfirmDelete,
        isOpenDelete,
        onCloseDeleteDialog,
        onOpen
    } = useCertificatesContext()

    return (
        <Box borderWidth='1px' borderRadius='lg' overflow='hidden' padding={10} m={10}>
            <HeaderViewTable
                name="Certificates"
            >
                <Stack direction='row'
                    spacing={4}
                    flex={1}
                    justifyContent={'flex-end'}
                    marginX={5}
                >

                    <Button
                        leftIcon={<FiPlus />}
                        colorScheme='teal'
                        variant='solid'
                        onClick={onOpen}
                        px={6}
                    >
                        Add
                    </Button>
                </Stack>
            </HeaderViewTable>

            <Stack alignItems={'center'}>
                <CertificatesList />
            </Stack>
            <ModalAdd />

            <DeleteDialog
                isOpen={isOpenDelete}
                onCancel={onCloseDeleteDialog}
                onDelete={handleConfirmDelete}
            />
        </Box>
    )
}

export default MainCertificates