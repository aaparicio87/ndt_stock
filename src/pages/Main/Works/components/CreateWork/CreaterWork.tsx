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
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const INITIAL_STATE: TWork = {
    name: "",
    customer: "",
    address: "",
    certifications: [],
    description: "",
    documentationTime: "",
    expiredDate: "",
    invoiceNumber: "",
    needToDeliver: false,
    reportNumber: "",
    reportPlace: "",
    timeAtTheClient: "",
    workers: [],
}


const CreaterWork = () => {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<TWork>({
        defaultValues: INITIAL_STATE,
    });


    const onSubmit = async () => {

        try {

        } catch (error) {

        } finally {

        }
    };
    return (
        <Container maxW={'5xl'}>
            <Heading
                as='h3'
                size='lg'
                noOfLines={1}
            >
                Create a new work
            </Heading>
            <Box as={"form"} onSubmit={handleSubmit(onSubmit)} mt={5}>
                <HStack spacing={4} py={4}>
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