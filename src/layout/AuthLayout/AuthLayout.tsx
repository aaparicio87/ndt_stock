
import { Outlet } from "react-router-dom"
import { Box } from '@chakra-ui/react'
import {
    Flex,
    Heading,
    Stack,
    useColorModeValue
} from "@chakra-ui/react";
import { LogoCompany } from "../../components";

export const AuthLayout = () => {
    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}
        >
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                    <LogoCompany route="/login" />
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Outlet />
                </Box>
            </Stack>
        </Flex>
    )
}
