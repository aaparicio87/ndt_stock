import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput,
    NumberInputField, NumberInputStepper,
    Select,
    Switch,
    Textarea
} from "@chakra-ui/react";
import { Loader, MultiSelect } from "../../../../../components";
import { useWorkContext } from "../../../../../context/WorkContext.tsx";
import { handleKeyDown } from "../../../../../utils/functions.ts";

const WorkForm = () => {

    const {
        isLoading,
        certificatesList,
        customersList,
        workersList,
        workersSelected,
        itemsCertificates,
        customerSelected,
        handleCreateUpdateWork,
        errors,
        handleChangeItemCertificates,
        handleChangeWorkersSelect,
        handleChangeCustomersSelect,
        register,
        isSubmitting,
        handleCancel,
        showTraveling,
        handleToogleTraveling
    } = useWorkContext()

    return (
        <>
            {
                !isLoading
                    ? <Box as={"form"} onSubmit={handleCreateUpdateWork} mt={5}>
                        <HStack py={3} >
                            <FormControl isInvalid={!!errors.typeWork}>
                                <FormLabel>Type of work</FormLabel>
                                <MultiSelect
                                    options={certificatesList}
                                    value={itemsCertificates}
                                    onChange={handleChangeItemCertificates}
                                />
                                <FormErrorMessage>
                                    {errors.typeWork && errors.typeWork.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>

                        <HStack py={3} >

                            <FormControl isInvalid={!!errors.workers}>
                                <FormLabel>Workers</FormLabel>
                                <MultiSelect
                                    options={workersList}
                                    value={workersSelected}
                                    onChange={handleChangeWorkersSelect}
                                />
                                <FormErrorMessage>
                                    {errors.workers && errors.workers.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>

                        <HStack spacing={4}>
                            <FormControl isInvalid={!!errors.customer}>
                                <FormLabel>Customer</FormLabel>
                                <Select
                                    placeholder='Select customer'
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
                                    {errors.customer && errors.customer.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>

                        <HStack spacing={4} py={3}>
                            <FormControl isInvalid={!!errors.startDate}>
                                <FormLabel>Start date</FormLabel>
                                <Input
                                    placeholder='Start date'
                                    size='md'
                                    type='date'
                                    onKeyDown={handleKeyDown}
                                    {...register('startDate')}
                                />
                                <FormErrorMessage>
                                    {errors.startDate && errors.startDate.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.endDate}>
                                <FormLabel>End date</FormLabel>
                                <Input
                                    placeholder='End date'
                                    size='md'
                                    type='date'
                                    onKeyDown={handleKeyDown}
                                    {...register('endDate')}
                                />
                                <FormErrorMessage>
                                    {errors.endDate && errors.endDate.message}
                                </FormErrorMessage>
                            </FormControl>

                        </HStack>

                        <HStack py={3}>
                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    placeholder='Put a small description of the work'
                                    {...register('description')}
                                />
                                <FormErrorMessage>
                                    {errors.description && errors.description.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>

                        <HStack spacing={4} py={3}>
                            <FormControl isInvalid={!!errors.reportNumber}>
                                <FormLabel>Report number</FormLabel>
                                <Input
                                    placeholder='Enter report number'
                                    {...register('reportNumber')}
                                />
                                <FormErrorMessage>
                                    {errors.reportNumber && errors.reportNumber.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.reportPlace}>
                                <FormLabel>Report place</FormLabel>
                                <Input
                                    placeholder='Enter report place'
                                    {...register('reportPlace')}
                                />
                                <FormErrorMessage>
                                    {errors.reportPlace && errors.reportPlace.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>

                        <HStack spacing={4} py={3}>
                            <FormControl>
                                <FormLabel>Address</FormLabel>
                                <Input
                                    placeholder='Enter the address'
                                    {...register('address')}
                                />
                                <FormErrorMessage>
                                    {errors.address && errors.address.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.invoiceNumber}>
                                <FormLabel>Invoice number</FormLabel>
                                <Input
                                    placeholder='Enter invoice number'
                                    {...register('invoiceNumber')}
                                />
                                <FormErrorMessage>
                                    {errors.invoiceNumber && errors.invoiceNumber.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>

                        <HStack spacing={4} py={3}>
                            <FormControl>
                                <FormLabel>Max worked hrs</FormLabel>
                                <NumberInput
                                    min={0}
                                    defaultValue={0}
                                >
                                    <NumberInputField
                                        {...register('maxWorkedHours')}
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>
                                    {errors.maxWorkedHours && errors.maxWorkedHours.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Films</FormLabel>
                                <NumberInput
                                    min={0}
                                    defaultValue={0}
                                >
                                    <NumberInputField
                                        {...register('films')}
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>
                                    {errors.films && errors.films.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Cans</FormLabel>
                                <NumberInput
                                    min={0}
                                    defaultValue={0}
                                >
                                    <NumberInputField
                                        {...register('cans')}
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>
                                    {errors.cans && errors.cans.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl>
                                <FormLabel>
                                    Need to deliver?
                                </FormLabel>
                                <Switch
                                    colorScheme='teal'
                                    size='lg'
                                    alignSelf={'center'}
                                    {...register('needToDeliver')}
                                />
                            </FormControl>
                        </HStack>

                        <HStack spacing={3} py={3}>
                            <FormControl width={'auto'} mb={2}>
                                <FormLabel>
                                    Traveling
                                </FormLabel>
                                <Switch
                                    colorScheme='teal'
                                    size='lg'
                                    alignSelf={'center'}
                                    {...register('traveling', {
                                        onChange: () => handleToogleTraveling()
                                    })}
                                />
                            </FormControl>
                            {
                                showTraveling && <>
                                    <FormControl isInvalid={!!errors.travelFrom}>
                                        <FormLabel>From:</FormLabel>
                                        <Input
                                            placeholder='Enter start place from'
                                            {...register('travelFrom')}
                                        />
                                        <FormErrorMessage>
                                            {errors.travelFrom && errors.travelFrom.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.travelTo}>
                                        <FormLabel>To:</FormLabel>
                                        <Input
                                            placeholder='Enter end place to'
                                            {...register('travelTo')}
                                        />
                                        <FormErrorMessage>
                                            {errors.travelTo && errors.travelTo.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.distance}>
                                        <FormLabel>Distance(Km)</FormLabel>
                                        <NumberInput
                                            min={0}
                                            defaultValue={0}
                                        >
                                            <NumberInputField
                                                {...register('distance')}
                                            />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        <FormErrorMessage>
                                            {errors.distance && errors.distance.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                </>
                            }
                        </HStack>
                        {
                            showTraveling &&
                            <HStack spacing={4} py={3}>
                                <FormControl>
                                    <FormLabel>Plate</FormLabel>
                                    <Input
                                        placeholder='Enter the vehicle plate'
                                        {...register('carPlate')}
                                    />
                                    <FormErrorMessage>
                                        {errors.carPlate && errors.carPlate.message}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errors.startTimeTravel}>
                                    <FormLabel>Start time</FormLabel>
                                    <Input
                                        placeholder='Select start time'
                                        size='md'
                                        type='time'
                                        onKeyDown={handleKeyDown}
                                        {...register('startTimeTravel')}
                                    />
                                    <FormErrorMessage>
                                        {errors.startTimeTravel && errors.startTimeTravel.message}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errors.stopTimeTravel}>
                                    <FormLabel>End time</FormLabel>
                                    <Input
                                        placeholder='Select stop time'
                                        size='md'
                                        type='time'
                                        onKeyDown={handleKeyDown}
                                        {...register('stopTimeTravel')}
                                    />
                                    <FormErrorMessage>
                                        {errors.stopTimeTravel && errors.stopTimeTravel.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </HStack>
                        }


                        <Flex justifyContent={'flex-end'} mt={4} gap={4}>
                            <Button
                                colorScheme="teal"
                                isLoading={isSubmitting}
                                type="submit"
                                isDisabled={isSubmitting}
                            >
                                Submit
                            </Button>
                            <Button onClick={handleCancel} isDisabled={isSubmitting}>
                                Cancel
                            </Button>

                        </Flex>
                    </Box>
                    : <Loader />
            }
        </>
    )
}

export default WorkForm
