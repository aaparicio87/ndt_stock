
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Select, Textarea
} from "@chakra-ui/react";
import { MultiSelect } from "../../../../../components";
import React from "react";
import { useWorkedHoursContext } from "../../../../../context/WorkedHoursContext.tsx";
import TravelingForm from "../../../../../components/Travelign/Traveling.tsx";


type TProps = {
    onClose: () => void
    isOpen: boolean
}

const ModalEdit = ({ onClose, isOpen }: TProps) => {

    const {
        initialRef,
        finalRef,
        handleCreateWorkHour,
        register,
        errors,
        handleChangeCustomersSelect,
        customersList,
        customerSelected,
        certificatesList,
        itemsCertificates,
        handleChangeItemCertificates,
        isSubmitting,
        handleGetAllCustomers,
        handleGetAllCertificates,
        openToast,
        workHourSelected,
        showTraveling,
        handleToogleTraveling
    } = useWorkedHoursContext()

    React.useEffect(() => {
        const customers = handleGetAllCustomers()
        const certificates = handleGetAllCertificates()
        Promise.allSettled([customers, certificates])
            .catch((errors) => openToast('error', JSON.stringify(errors), "Error"))

    }, [handleGetAllCustomers, handleGetAllCertificates])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
    };

    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
            size={'2xl'}
            closeOnOverlayClick={false}

        >
            <ModalOverlay />
            <form onSubmit={handleCreateWorkHour}>
                <ModalContent>
                    <ModalHeader>{workHourSelected ? "Edit event" : "Create event"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={1}>
                        <HStack spacing={4}>
                            <FormControl isInvalid={!!errors.date}>
                                <FormLabel>Date</FormLabel>
                                <Input
                                    placeholder='Select Date'
                                    size='md'
                                    type='date'
                                    {...register('date')}
                                    onKeyDown={handleKeyDown}
                                />
                                <FormErrorMessage>
                                    {errors.date && errors.date.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.client}>
                                <FormLabel>Client</FormLabel>
                                <Select
                                    placeholder='Select client'
                                    onChange={handleChangeCustomersSelect}
                                    value={customerSelected}
                                >
                                    {
                                        customersList.map((customer, index) => (
                                            <option value={customer.value} key={index}>{customer.label}</option>
                                        ))
                                    }
                                </Select>
                                <FormErrorMessage>
                                    {errors.client && errors.client.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                        <HStack spacing={4} py={2}>
                            <FormControl isInvalid={!!errors.location}>
                                <FormLabel>Location</FormLabel>
                                <Input
                                    placeholder='Location'
                                    {...register('location')}
                                />
                                <FormErrorMessage>
                                    {errors.location && errors.location.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.ndtMethods} isDisabled={showTraveling}>
                                <FormLabel>Ndt methods</FormLabel>
                                <MultiSelect
                                    options={certificatesList}
                                    value={itemsCertificates}
                                    onChange={handleChangeItemCertificates}
                                    isDisabled={showTraveling}
                                />
                                <FormErrorMessage>
                                    {errors.ndtMethods && errors.ndtMethods.message}
                                </FormErrorMessage>
                            </FormControl>

                        </HStack>

                        <HStack spacing={4} py={1}>
                            <FormControl isInvalid={!!errors.startTime}>
                                <FormLabel>Start time</FormLabel>
                                <Input
                                    placeholder='Select start time'
                                    size='md'
                                    type='time'
                                    onKeyDown={handleKeyDown}
                                    {...register('startTime')}
                                />
                                <FormErrorMessage>
                                    {errors.startTime && errors.startTime.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.endTime}>
                                <FormLabel>End time</FormLabel>
                                <Input
                                    placeholder='Select end time'
                                    size='md'
                                    type='time'
                                    onKeyDown={handleKeyDown}
                                    {...register('endTime')}
                                />
                                <FormErrorMessage>
                                    {errors.endTime && errors.endTime.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                        <TravelingForm
                            errors={errors}
                            register={register}
                            onToogleSwitch={handleToogleTraveling}
                            showTraveling={showTraveling}
                            isWork={false}
                        />
                        <HStack pt={1}>
                            <FormControl>
                                <FormLabel>Note</FormLabel>
                                <Textarea
                                    placeholder='Put a small description of the work'
                                    {...register('note')}
                                />
                                <FormErrorMessage>note
                                    {errors.note && errors.note.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='teal'
                            variant='solid'
                            mr={3}
                            isLoading={isSubmitting}
                            type='submit'
                        >
                            {workHourSelected ? "Update" : "Save"}
                        </Button>
                        <Button onClick={onClose} isDisabled={isSubmitting}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )

}
export default ModalEdit
