import { FieldValues, UseFormRegister, FieldErrors } from 'react-hook-form';
import { HStack } from '@chakra-ui/react';
import { FormField } from '../FromField/FormField';


interface TravelingFormProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    showTraveling: boolean
    isWork: boolean
    onToogleSwitch: () => void
}

const TravelingForm = <T extends FieldValues>({
    register,
    errors,
    isWork = false,
    showTraveling,
    onToogleSwitch
}: TravelingFormProps<T>) => {

    return (
        <>
            <HStack spacing={1} py={2}>
                <FormField
                    name="traveling"
                    label="Traveling"
                    register={register}
                    error={errors.traveling as any}
                    isSwitch
                    onToogleSwitch={onToogleSwitch}
                />
                {showTraveling && (
                    <HStack spacing={3}>
                        <FormField
                            name="travelFrom"
                            label="From"
                            placeholder="Enter start place"
                            register={register}
                            error={errors.travelFrom as any}
                        />
                        <FormField
                            name="travelTo"
                            label="To"
                            placeholder="Enter end place"
                            register={register}
                            error={errors.travelTo as any}
                        />
                        <FormField
                            name="distance"
                            label="Distance(Km)"
                            register={register}
                            error={errors.distance as any}
                            isNumberInput
                            min={0}
                        />
                    </HStack>
                )}
            </HStack>
            {(showTraveling && !isWork) && (
                <HStack spacing={4} py={2} w={'xs'}>
                    <FormField
                        name="carPlate"
                        label="Plate"
                        placeholder="Enter the vehicle plate"
                        register={register}
                        error={errors.carPlate as any}
                    />
                    {/*  <FormField
                        name="startTimeTravel"
                        label="Start time"
                        type="time"
                        register={register}
                        error={errors.startTimeTravel as any}
                    />
                    <FormField
                        name="stopTimeTravel"
                        label="End time"
                        type="time"
                        register={register}
                        error={errors.stopTimeTravel as any}
                    /> */}
                </HStack>
            )}
        </>
    );
};

export default TravelingForm;
