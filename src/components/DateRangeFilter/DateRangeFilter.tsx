import { Button, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Input } from '@chakra-ui/react'
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
}

const DateRangeFilter = ({
    onFilter,
    register,
    startDateErrorCustom,
    endDateErrorCustom,
    isSubmitting,
    displayReset,
    onReset,
}: TProps) => {


    return (
        <form>
            <HStack spacing={3}>
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
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignSelf={(startDateErrorCustom || endDateErrorCustom) ? 'center' : 'flex-end'}
                    width={'80%'}
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
            </HStack>
        </form>
    )
}

export default DateRangeFilter