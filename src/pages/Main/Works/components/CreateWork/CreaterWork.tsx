import React, { ChangeEvent } from 'react';
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    Input,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Switch,
    Select,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form';
import { MultiSeleect } from '../../../../../components';
import { Option } from 'chakra-multiselect';
import { useWorks } from '../../hooks/useWorks';
//import { zodResolver } from '@hookform/resolvers/zod';

const INITIAL_STATE: TWork = {
    name: "",
    customer: undefined,
    description: "",
    typeWork: [],
    startDate: "",
    endDate: "",
    reportNumber: "",
    invoiceNumber: "",
    reportPlace: "",
    films: 0,
    cans: 0,
    address: "",
    //documentationTime: 0,
    needToDeliver: false,
    workers: [],
    //billed: ""
}



const CreaterWork = () => {
    const {
        workersRemote,
        certificatesRemote,
        customersRemote,
        certificatesList,
        customersList,
        workersList,
        handleGetAllStaff,
        handleGetAllCustomers,
        handleGetAllCertificates,
    } = useWorks()

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<TWork>({
        defaultValues: INITIAL_STATE,
    });
    const [itemsCertificates, setItemsCertificates] = React.useState<Option | Option[]>([])
    const [workersSelected, setWorkersSelected] = React.useState<Option | Option[]>([])

    const onChangeItemCertificates = (data: Option | Option[]) => {
        setItemsCertificates(data)
        const dataArray = data as Option[]
        const typeWork = dataArray.map((d) => {
            const tWork: TCertificates = { uid: d.value as string, name: d.label }
            return tWork
        })
        setValue('typeWork', typeWork)
    }

    const onChangeWorkersSelect = (data: Option | Option[]) => {
        setWorkersSelected(data)
        const dataArray = data as Option[]
        const workerToSave = workersRemote.current.filter(item => dataArray.map(data => data.value as string).includes(item.uid ?? ''));
        setValue('workers', workerToSave)
    }

    const onChangeCustomers = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const customerSelected = customersRemote.current.find((cr) => cr.uid === selectedValue)
        setValue('customer', customerSelected)
    }


    React.useEffect(() => {

        const p1 = handleGetAllStaff()
        const p2 = handleGetAllCustomers()
        const p3 = handleGetAllCertificates()
        Promise.allSettled([p1, p2, p3])

    }, [])



    const onSubmit = async () => {

        try {

        } catch (error) {

        } finally {

        }
    };
    return (
        <Container maxW={'4xl'}>
            <Heading
                as='h3'
                size='lg'
                noOfLines={1}
            >
                Create a new work
            </Heading>
            <Box as={"form"} onSubmit={handleSubmit(onSubmit)} mt={5}>
                <HStack spacing={4}>
                    <FormControl>
                        <FormLabel>Work name</FormLabel>
                        <Input
                            placeholder='Enter work name'
                            {...register('name')}
                        />
                        <FormErrorMessage>
                            {errors.name && errors.name.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.customer}>
                        <FormLabel>Customer</FormLabel>
                        <Select
                            placeholder='Select customer'
                            {...register('customer')}
                            onChange={onChangeCustomers}
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
                    <FormControl>
                        <FormLabel>Start date</FormLabel>
                        <Input
                            placeholder='Start date'
                            size='md'
                            type='date'
                            {...register('startDate')}
                        />
                        <FormErrorMessage>
                            {errors.startDate && errors.startDate.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl>
                        <FormLabel>End date</FormLabel>
                        <Input
                            placeholder='En date'
                            size='md'
                            type='date'
                            {...register('endDate')}
                        />
                        <FormErrorMessage>
                            {errors.endDate && errors.endDate.message}
                        </FormErrorMessage>
                    </FormControl>

                </HStack>
                {
                    workersList.length > 0 &&
                    <HStack py={3} >
                        <FormControl isInvalid={!!errors.workers}>
                            <MultiSeleect
                                options={workersList}
                                value={workersSelected}
                                label='Workers'
                                placeholder='Select workers'
                                size='md'
                                onChange={onChangeWorkersSelect}
                            />
                            <FormErrorMessage>
                                {errors.workers && errors.workers.message}
                            </FormErrorMessage>
                        </FormControl>
                    </HStack>
                }
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
                <HStack py={3} >
                    <FormControl isInvalid={!!errors.typeWork}>
                        <MultiSeleect
                            options={certificatesList}
                            value={itemsCertificates}
                            label='Certifications'
                            placeholder='Select certifications'
                            size='md'
                            onChange={onChangeItemCertificates}
                        />
                        <FormErrorMessage>
                            {errors.typeWork && errors.typeWork.message}
                        </FormErrorMessage>
                    </FormControl>
                </HStack>
                <HStack spacing={4} py={3}>
                    <FormControl>
                        <FormLabel>Report number</FormLabel>
                        <Input
                            placeholder='Enter customer name'
                            {...register('reportNumber')}
                        />
                        <FormErrorMessage>
                            {errors.customer && errors.customer.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl>
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
                    <FormControl>
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
                {/*  <HStack spacing={4} py={3}>
                     <FormControl>
                        <FormLabel>Documentation time</FormLabel>
                        <NumberInput
                            min={0}
                            defaultValue={0}
                        >
                            <NumberInputField
                                {...register('documentationTime')}
                            />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>
                            {errors.documentationTime && errors.documentationTime.message}
                        </FormErrorMessage>
                    </FormControl>
                     <FormControl>
                        <FormLabel>Billed</FormLabel>
                        <Input
                            placeholder='Billed'
                            {...register('billed')}
                        />
                        <FormErrorMessage>
                            {errors.billed && errors.billed.message}
                        </FormErrorMessage>
                    </FormControl>
                </HStack> */}
                <HStack spacing={5} py={3}>
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
                        <FormLabel htmlFor='need-deliver'>
                            Need to deliver?
                        </FormLabel>
                        <Switch
                            id='need-deliver'
                            colorScheme='teal'
                            size='lg'
                            alignSelf={'center'}
                        />
                    </FormControl>
                </HStack>
                <Flex justifyContent={'flex-end'}>
                    <Button
                        mt={4}
                        colorScheme="teal"
                        isLoading={isSubmitting}
                        type="submit"
                        isDisabled={isSubmitting}
                    >
                        Submit
                    </Button>
                </Flex>
            </Box>
        </Container>
    )
}

export default CreaterWork