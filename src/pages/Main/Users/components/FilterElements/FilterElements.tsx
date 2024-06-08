import {
    HStack,
    Input,
    Select as ChakraSelect,
    Button,
    VStack,
    InputGroup,
    InputRightElement,
    IconButton,
} from "@chakra-ui/react"
import { MenuFilter } from "../../../../../components"
import { DEGREES } from "../../../../../utils/constants"
import { FiXCircle } from "react-icons/fi";



const FilterElements = () => {

    return (
        <HStack spacing={3} width={"40%"}>
            <MenuFilter name="Email" titleGroup="Filter by email">
                <VStack spacing={3}>
                    <InputGroup mb={4}>
                        <Input
                            placeholder="jhon.doe@gmail.com"
                            size='md'
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
                    <Button
                        size='sm'
                        w='100%'
                        colorScheme='teal'
                        variant='solid'
                    >
                        Apply
                    </Button>
                </VStack>
            </MenuFilter>
            <MenuFilter name="Degree" titleGroup="Filter by degree">
                <VStack spacing={3}>
                    <HStack w={'100%'}>
                        <ChakraSelect
                            placeholder='Select degree'
                            variant='outline'
                            pr={2}
                        >
                            {
                                DEGREES.map((type, index) => (
                                    <option value={type} key={index}>{type}</option>
                                ))
                            }
                        </ChakraSelect>
                        {true && (
                            <IconButton
                                aria-label="Clear select"
                                icon={<FiXCircle />}
                                size="sm"
                                onClick={() => { }}
                                variant="ghost"
                                position="absolute"
                                right="0.5rem"
                                top="50%"
                                transform="translateY(-55%)"
                                zIndex="1"
                            />
                        )}
                    </HStack>
                    <Button
                        size='sm'
                        w='100%'
                        colorScheme='teal'
                        variant='solid'
                    >
                        Apply
                    </Button>
                </VStack>
            </MenuFilter>
        </HStack>
    )
}

export default FilterElements