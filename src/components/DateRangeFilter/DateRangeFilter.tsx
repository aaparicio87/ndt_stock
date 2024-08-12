import { Button, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack, StackDirection } from '@chakra-ui/react'
import { handleKeyDown } from '../../utils/functions'
import { FiSearch } from 'react-icons/fi'
import { UseFormRegister } from 'react-hook-form'

type TProps = {
    onFilter: () => Promise<void>
    register: UseFormRegister<any>
    startDateErrorCustom: string | undefined,
    endDateErrorCustom: string | undefined,
    isSubmitting: boolean
    displayReset: boolean
    onReset: () => Promise<void>
    direction?: StackDirection | undefined
}

const DateRangeFilter = ({
    onFilter,
    register,
    startDateErrorCustom,
    endDateErrorCustom,
    isSubmitting,
    displayReset,
    onReset,
    direction,
}: TProps) => {


    return (
        <form>
            <Stack spacing={5} direction={direction}>
                <FormControl isInvalid={!!startDateErrorCustom}>
                    <FormLabel >Start date</FormLabel>
                    <Flex direction={'column'}>
                        <Input
                            placeholder='Start date'
                            size='sm'
                            type='date'
                            onKeyDown={handleKeyDown}
                            {...register('startDate')}
                        />
                        <FormErrorMessage>
                            {startDateErrorCustom ?? null}
                        </FormErrorMessage>
                    </Flex>
                </FormControl>
                <FormControl isInvalid={!!endDateErrorCustom}>
                    <FormLabel>End date</FormLabel>
                    <Flex direction={'column'}>
                        <Input
                            placeholder='End date'
                            size='sm'
                            type='date'
                            onKeyDown={handleKeyDown}
                            {...register('endDate')}
                        />
                        <FormErrorMessage>
                            {endDateErrorCustom ?? null}
                        </FormErrorMessage>
                    </Flex>
                </FormControl>
                <Flex
                    flexDirection={'column'}
                    justifyContent={'center'}
                    gap={5}
                >
                    <Button
                        type="submit"
                        leftIcon={<FiSearch />}
                        colorScheme='teal'
                        variant='solid'
                        size={'sm'}
                        onClick={onFilter}
                        disabled={isSubmitting}
                    >
                        Filter
                    </Button>
                    {
                        displayReset &&
                        <Button
                            type="submit"
                            colorScheme='teal'
                            variant='solid'
                            size={'sm'}
                            onClick={onReset}
                            disabled={isSubmitting}
                        >
                            Reset
                        </Button>
                    }
                </Flex>
            </Stack>
        </form>
    )
}

export default DateRangeFilter