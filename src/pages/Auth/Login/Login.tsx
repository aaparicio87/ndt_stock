import React from "react";
import {
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link as ChakraLink,
    Button, FormErrorMessage, InputGroup, InputRightElement
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LOGIN_VALIDATION_SCHEMA } from "../../../utils/validationSchemas";
import { useAuth } from "../../../hooks/useAuth";
import { useNotification } from "../../../hooks/useNotification";

const INITIAL_STATE: TSignIn = {
    email: "",
    password: "",
}

export const Login = () => {

    const { login } = useAuth()
    const { openToast } = useNotification()
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TSignIn>({
        defaultValues: {
            ...INITIAL_STATE
        },
        resolver: zodResolver(LOGIN_VALIDATION_SCHEMA)
    });

    const onSubmit = async (data: TSignIn) => {
        try {
            await login(data)
        } catch (error) {
            openToast('error', JSON.stringify(error), "Error")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
                <FormControl id="email" isInvalid={errors.email ? true : undefined}>
                    <FormLabel htmlFor='email'>Email address</FormLabel>
                    <Input
                        id='name'
                        type="email"
                        {...register('email')}
                    />
                    <FormErrorMessage>
                        {errors.email && errors.email.message}
                    </FormErrorMessage>
                </FormControl>
                <FormControl id="password" isInvalid={errors.password ? true : undefined}>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <InputGroup size='md'>
                    <Input
                        type={show ? 'text' : 'password'}
                        id='password'
                        {...register('password')}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                        {errors.password && errors.password.message}
                    </FormErrorMessage>
                </FormControl>
                <Stack spacing={10}>
                    <Stack
                        direction={{ base: 'column', sm: 'row' }}
                        align={'start'}
                    >

                        <ChakraLink as={ReactRouterLink} to='/forgot'>
                            Forgot password?
                        </ChakraLink>
                    </Stack>
                    <Button
                        colorScheme='teal'
                        variant='solid'
                        isLoading={isSubmitting}
                        type="submit"
                    >
                        Sign in
                    </Button>
                </Stack>
            </Stack>
        </form>
    )
}
