import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
import { ZodSchema } from "zod";

export const useFilterForm = <T extends FieldValues>(
    validationSchema: ZodSchema<T>,
) => {
    const {
        register,
        getValues,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<T>({
        resolver: zodResolver(validationSchema),
    });

    return {
        register,
        errors,
        isSubmitting,
        handleSubmit,
        getValues,
        isSubmitSuccessful,
        reset,
        setValue
    };
};