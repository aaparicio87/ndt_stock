import React from "react"
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button
} from "@chakra-ui/react"

type TProps = {
    isOpen: boolean
    onCancel: () => void
    onDelete: () => void
}

export function DeleteDialog({ isOpen, onCancel, onDelete }: TProps) {


    const cancelRef = React.useRef<any>()

    return (


        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onCancel}
            closeOnOverlayClick={false}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete Element
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' onClick={onDelete} ml={3}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>

    )
}