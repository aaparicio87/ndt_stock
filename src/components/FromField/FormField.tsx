import React from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    Switch,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormErrorMessage,
} from '@chakra-ui/react';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface FormFieldProps {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    register: UseFormRegister<any>;
    error?: FieldError;
    isSwitch?: boolean;
    isNumberInput?: boolean;
    min?: number;
    [key: string]: any;
    onToogleSwitch?: () => void
}

export const FormField: React.FC<FormFieldProps> = ({
    name,
    label,
    type = 'text',
    placeholder,
    register,
    error,
    isSwitch = false,
    isNumberInput = false,
    min,
    onToogleSwitch,
    ...rest
}) => {
    return (
        <FormControl isInvalid={!!error} width={isSwitch ? '15%' : '100%'}>
            <FormLabel>{label}</FormLabel>
            {isSwitch ? (
                <Switch
                    colorScheme='teal'
                    size='lg'
                    alignSelf={'center'}
                    {...register(name, {
                        onChange: () => onToogleSwitch && onToogleSwitch()
                    })}
                    pb={3}
                    {...rest}
                />

            ) : isNumberInput ? (
                <NumberInput min={min} {...rest}>
                    <NumberInputField {...register(name)} />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            ) : (
                <Input type={type} placeholder={placeholder} {...register(name)} {...rest} />
            )}
            <FormErrorMessage>{error && error.message}</FormErrorMessage>
        </FormControl>
    );
};
