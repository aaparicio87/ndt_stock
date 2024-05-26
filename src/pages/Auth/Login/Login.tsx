import {
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link as ChakraLink,
    Button, FormErrorMessage
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LOGIN_VALIDATION_SCHEMA } from "../../../utils/validationSchemas";
import { useAuth } from "../../../hooks/useAuth";

const INITIAL_STATE: TSignIn = {
    email: "",
    password: "",
}

export const Login = () => {

    const { login } = useAuth()

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
            console.error(error)
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
                    <Input
                        type="password"
                        id='password'
                        {...register('password')}
                    />
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
