import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues, DefaultValues } from "react-hook-form";
import { ZodSchema } from "zod";

export const useFilterForm = <T extends FieldValues>(
    validationSchema: ZodSchema<T>,
    defaultValues?: DefaultValues<T> | undefined
) => {
    const {
        register,
        getValues,
        handleSubmit,
        reset,
        setValue,
        resetField,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<T>({
        resolver: zodResolver(validationSchema),
        defaultValues
    });

    return {
        register,
        errors,
        isSubmitting,
        handleSubmit,
        getValues,
        isSubmitSuccessful,
        reset,
        setValue,
        resetField
    };
};