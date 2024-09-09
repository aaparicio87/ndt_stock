import React from 'react';
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input, InputGroup, InputRightElement,
    VStack
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form';
import { CHANGE_PASSWORD_SCHEMA } from '../../../../../utils/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePassword } from '../../../../../services';
import { useNotification } from '../../../../../hooks/useNotification';
import { useUser } from '../../../Users/hooks/useUsers';

interface IInitialState {
    currentPassword: string
    password: string
    confirm: string
}

const INITIAL_STATE: IInitialState = {
    currentPassword: "",
    password: "",
    confirm: "",
}

const Security = () => {
    const { user } = useUser()
    const { openToast } = useNotification()
    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<IInitialState>({
        defaultValues: INITIAL_STATE,
        resolver: zodResolver(CHANGE_PASSWORD_SCHEMA)
    });
    const [show, setShow] = React.useState(false)
    const [showNew, setShowNew] = React.useState(false)
    const [showConfirm, setShowConfirm] = React.useState(false)
    const handleClick = () => setShow((prev) => !prev)
    const handleClickNew = () => setShowNew((prev) => !prev)
    const handleClickConfirm = () => setShowConfirm((prev) => !prev)

    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
        }

    }, [isSubmitSuccessful])

    const onSubmit = async (data: IInitialState) => {
        try {
            if (!user) {
                openToast('error', 'Internal server Error', "Error")
                return
            }
            const { password, currentPassword } = data
            const response = await changePassword(password, currentPassword, user.email)

            if (response.success) {
                openToast('success', "Password changed succesfully", 'Success')
            } else {
                openToast('error', response.error ?? 'Internal server Error', "Error")
            }
        } catch (error) {
            openToast('error', (error as Error).message, "Error")
        }
    }

    return (
        <Container maxW={'3xl'}>
            <Box as={"form"} onSubmit={handleSubmit(onSubmit)} mt={5}>
                <VStack py={3} spacing={6}>
                    <FormControl isInvalid={!!errors.currentPassword}>
                        <FormLabel>Current Password</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                type={show ? 'text' : 'password'}
                                placeholder='Current Password'
                                {...register("currentPassword")}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                            {errors.currentPassword && errors.currentPassword.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.password}>
                        <FormLabel>New Password</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                type={showNew ? 'text' : 'password'}
                                placeholder='New Password'
                                {...register("password")}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClickNew}>
                                    {showNew ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                            {errors.password && errors.password.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.confirm}>
                        <FormLabel>Confirm new password</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                type={showConfirm ? 'text' : 'password'}
                                placeholder='Confirm password'
                                {...register("confirm")}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClickConfirm}>
                                    {showConfirm ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                            {errors.confirm && errors.confirm.message}
                        </FormErrorMessage>
                    </FormControl>
                </VStack>
                <Flex justifyContent={'flex-end'}>
                    <Button
                        mt={4}
                        colorScheme="teal"
                        isLoading={isSubmitting}
                        type="submit"
                        isDisabled={isSubmitting}
                    >
                        Save changes
                    </Button>
                </Flex>
            </Box>
        </Container>
    )
}

export default Security
