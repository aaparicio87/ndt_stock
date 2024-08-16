import {
    Input,
    Button,
    VStack,
    InputGroup,
    InputRightElement,
    IconButton,
    FormControl,
    FormLabel,
    FormErrorMessage,
} from "@chakra-ui/react"
import { MenuFilter, MultiSelect } from "../../../../../components"
import { FiXCircle } from "react-icons/fi";
import { ROLES } from "../../../../../utils/constants";
import { MultiValue } from "react-select";
import React from "react";
import { useStaffContext } from "../../../../../context/StaffContext";

const _optionsRoles = ROLES.map((label) => ({ label, value: label.toLowerCase() }))
const FilterElements = () => {
    const {
        errors,
        isSubmitting,
        register,
        setValue,
        handleFilterUsers,
        resetField
    } = useStaffContext()

    const [itemsRoles, setItemsRoles] = React.useState<MultiValue<TOptions>>([])

    const onChangeItemRoles = (data: MultiValue<TOptions>) => {
        setItemsRoles(data)
        const roles = data.map((r) => r.label as TRole)
        setValue('rolesFilter', roles)
    }

    return (
        <MenuFilter name="Filters" titleGroup="Filter by:">
            <form>
                <VStack spacing={3}>

                    <FormControl isInvalid={!!errors.name} isDisabled={isSubmitting}>
                        <FormLabel>First name</FormLabel>
                        <InputGroup mb={1}>
                            <Input
                                placeholder="Jhon"
                                size='md'
                                {...register('name')}
                            />
                            {true && (
                                <InputRightElement>
                                    <IconButton
                                        aria-label="Clear filter"
                                        icon={<FiXCircle />}
                                        size="sm"
                                        onClick={() => resetField('name')}
                                        variant="ghost"
                                    />
                                </InputRightElement>
                            )}
                        </InputGroup>
                        <FormErrorMessage>
                            {errors.name && errors.name.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl mb={2} isInvalid={!!errors.rolesFilter}>
                        <FormLabel>Roles</FormLabel>
                        <MultiSelect
                            options={_optionsRoles}
                            value={itemsRoles}
                            onChange={onChangeItemRoles}
                            menuPlacement="top"
                        />
                        <FormErrorMessage>
                            {errors.rolesFilter && errors.rolesFilter.message}
                        </FormErrorMessage>
                    </FormControl>
                    <Button
                        size='sm'
                        w='100%'
                        colorScheme='teal'
                        variant='solid'
                        type="submit"
                        onClick={handleFilterUsers}
                        disabled={isSubmitting}
                    >
                        Apply
                    </Button>
                </VStack>
            </form>
        </MenuFilter>
    )
}

export default FilterElements