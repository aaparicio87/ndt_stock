import {
    HStack,
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
    } = useStaffContext()

    const [itemsRoles, setItemsRoles] = React.useState<MultiValue<TOptions>>([])

    const onChangeItemRoles = (data: MultiValue<TOptions>) => {
        setItemsRoles(data)
        const roles = data.map((r) => r.label as TRole)
        setValue('rolesFilter', roles)
    }

    return (
        <HStack spacing={3} alignSelf={'end'} marginEnd={5}>
            <MenuFilter name="Filters" titleGroup="Filter by:">
                <form>
                    <VStack spacing={3}>

                        <FormControl isInvalid={!!errors.fullName} isDisabled={isSubmitting}>
                            <FormLabel>Full name</FormLabel>
                            <InputGroup mb={1}>
                                <Input
                                    placeholder="Jhon Doe"
                                    size='md'
                                    {...register('fullName')}
                                />
                                {true && (
                                    <InputRightElement>
                                        <IconButton
                                            aria-label="Clear filter"
                                            icon={<FiXCircle />}
                                            size="sm"
                                            onClick={() => { }}
                                            variant="ghost"
                                        />
                                    </InputRightElement>
                                )}
                            </InputGroup>
                            <FormErrorMessage>
                                {errors.fullName && errors.fullName.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.emailFilter}>
                            <FormLabel>E-mail</FormLabel>
                            <InputGroup mb={1}>
                                <Input
                                    placeholder="jhon.doe@gmail.com"
                                    size='md'
                                    {...register('emailFilter')}
                                />
                                {true && (
                                    <InputRightElement>
                                        <IconButton
                                            aria-label="Clear filter"
                                            icon={<FiXCircle />}
                                            size="sm"
                                            onClick={() => { }}
                                            variant="ghost"
                                        />
                                    </InputRightElement>
                                )}
                            </InputGroup>
                            <FormErrorMessage>
                                {errors.emailFilter && errors.emailFilter.message}
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
        </HStack>
    )
}

export default FilterElements