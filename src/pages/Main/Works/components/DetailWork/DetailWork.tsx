import {
    Box,
    Center,
    Container,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Icon,
    SimpleGrid,
    Text
} from '@chakra-ui/react';
import React from 'react'
import { useParams } from 'react-router-dom';
import { IDetailWork } from '../../hooks/useWorks';
import { Loader } from '../../../../../components';
import { FiInbox } from "react-icons/fi"
import {useWorkContext} from "../../../../../context/WorkContext.tsx";


const ELEMENTS_DISPLAY: { [key: string]: string } = {
    name: "Name",
    workers: "Workers",
    customer: "Customer",
    startDate: "Start date",
    endDate: "End date",
    description: "Description",
    reportNumber: "Report number",
    reportPlace: "Report place",
    address: "Address",
    invoiceNumber: "Invoice number",
    films: "Films",
    cans: "Cans",
    needToDeliver: "Need to deliver",
}

const DetailWork = () => {
    const { id } = useParams<{ id: string }>();
    const { isLoading,
            handleGetElementDetail,
            workElementDetail
            } = useWorkContext()

    React.useEffect(() => {
        (async () => {
            if (id) {
                await handleGetElementDetail(id)
            }
        })()
    }, [id]);

    if (isLoading) {
        <Loader />
    }

    return (
        <Container maxW={'4xl'}>
            <Heading
                as='h3'
                size='lg'
                noOfLines={1}
            >
                Work detail
            </Heading>
            <Box
                padding="4"
                maxW="3xl"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
                bg="white"
                mt={5}
            >
                <SimpleGrid columns={[1, null, 2]} spacing={4}>
                    {workElementDetail ?
                        Object.keys(ELEMENTS_DISPLAY).map((key) => {
                            if (workElementDetail.hasOwnProperty(key)) {
                                return (
                                    <FormControl key={key} isReadOnly>
                                        <HStack align={'baseline'}>
                                            <FormLabel fontWeight="bold" >{`${ELEMENTS_DISPLAY[key]}:`}</FormLabel>
                                            <Text >
                                                {workElementDetail[key as keyof IDetailWork]}
                                            </Text>
                                        </HStack>
                                    </FormControl>
                                );
                            }
                            return null;
                        }) : (
                            <Center py={10}>
                                <Icon as={FiInbox} w={10} h={10} mr={2} />
                                No data available
                            </Center>
                        )
                    }
                </SimpleGrid>
            </Box>
        </Container>
    )
}

export default DetailWork
