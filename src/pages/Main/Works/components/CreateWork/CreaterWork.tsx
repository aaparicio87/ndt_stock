import React, { useRef } from 'react';
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
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form';
import { CERTIFICATES } from '../../../../../utils/constants';
import { MultiSeleect } from '../../../../../components';
import { Option } from 'chakra-multiselect';
import { getAllStaff } from '../../../../../services';
//import { zodResolver } from '@hookform/resolvers/zod';

const INITIAL_STATE: TWork = {
    name: "",
    customer: "",
    description: "",
    certifications: [],
    expiredDate: "",
    reportNumber: "",
    invoiceNumber: "",
    reportPlace: "",
    films: 0,
    cans: 0,
    address: "",
    documentationTime: 0,
    needToDeliver: false,
    timeAtTheClient: "",
    workers: [],
    billed: ""
}

const _optionsCertificates = CERTIFICATES.map((label) => ({ label, value: label.toLowerCase() }))

const CreaterWork = () => {

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<TWork>({
        defaultValues: INITIAL_STATE,
    });
    const [itemsCertificates, setItemsCertificates] = React.useState<Option | Option[]>([])
    const [workersList, setWorkersList] = React.useState<{ label: string, value: string }[]>([])
    const workersRemote = useRef<TStaff[]>([])
    const [workersSelected, setWorkersSelected] = React.useState<Option | Option[]>([])

    const onChangeItemCertificates = (data: Option | Option[]) => {
        setItemsCertificates(data)
        const dataArray = data as Option[]
        const certificates = dataArray.map((d) => d.label as TCertificates)
        setValue('certifications', certificates)
    }

    const onChangeWorkersSelect = (data: Option | Option[]) => {
        setWorkersSelected(data)
        const dataArray = data as Option[]
        const workerToSave = workersRemote.current.filter(item => dataArray.map(data => data.value as string).includes(item.uid ?? ''));
        setValue('workers', workerToSave)
    }

    React.useEffect(() => {
        getAllStaff().then((response) => {
            if (!response) {
                console.error("No response from getAllStaff")
                return
            }
            workersRemote.current = response
            const listWorkers = response
                .filter((res) => res.roles.some((role) => role === 'USER'))
                .map((res) => ({
                    label: `${res.name} ${res.lastName}`,
                    value: `${res.uid}`
                }));
            setWorkersList(listWorkers)
        }).catch(error => {
            console.error("Error fetching staff: ", error)
        })
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
                    <FormControl>
                        <FormLabel>Customer</FormLabel>
                        <Input
                            placeholder='Enter customer name'
                            {...register('customer')}
                        />
                        <FormErrorMessage>
                            {errors.customer && errors.customer.message}
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
                <HStack py={3} >
                    <FormControl isInvalid={!!errors.certifications}>
                        <MultiSeleect
                            options={_optionsCertificates}
                            value={itemsCertificates}
                            label='Certifications'
                            placeholder='Select certifications'
                            size='md'
                            onChange={onChangeItemCertificates}
                        />
                        <FormErrorMessage>
                            {errors.certifications && errors.certifications.message}
                        </FormErrorMessage>
                    </FormControl>
                </HStack>
                <HStack spacing={4} py={3}>
                    <FormControl>
                        <FormLabel>Expiration date</FormLabel>
                        <Input
                            placeholder='Select expiration date'
                            size='md'
                            type='date'
                            {...register('expiredDate')}
                        />
                        <FormErrorMessage>
                            {errors.expiredDate && errors.expiredDate.message}
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
                </HStack>
                <HStack spacing={4} py={3}>
                    <FormControl>
                        <FormLabel>Time at the client</FormLabel>
                        <Input
                            placeholder='Time at the client'
                            {...register('timeAtTheClient')}
                        />
                        <FormErrorMessage>
                            {errors.timeAtTheClient && errors.timeAtTheClient.message}
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