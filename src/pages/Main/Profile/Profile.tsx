import {Avatar, Box, Flex, Icon, SimpleGrid, Tag, TagLabel, Text, WrapItem} from "@chakra-ui/react";
import {FiInbox, FiMapPin, FiPhone} from "react-icons/fi";

interface ISkill {
    id: number
    name: string
    color: string
}

const skills: ISkill[] = [
    {
        id: 1,
        name: "Project Management",
        color: "red"
    },
    {
        id: 2,
        name: "Data Analysis",
        color: "green"
    },
    {
        id: 3,
        name: "Communication",
        color: "blue"
    },
    {
        id: 4,
        name: "Strategic Planning",
        color: "pink"
    },
    {
        id: 5,
        name: "Negotiation",
        color: "purple"
    },
    {
        id: 6,
        name: "Time Management",
        color: "orange"
    },
    {
        id: 7,
        name: "Product Development",
        color: "cyan"
    },
    {
        id: 9,
        name: "Market Research",
        color: "green"
    },
    {
        id: 10,
        name: "Leadership",
        color: "blue"
    },
    {
        id: 14,
        name: "Testing and QA",
        color: "teal"
    }
]

export const Profile = () => {
    return (
        <Flex direction="column">

            <Box boxShadow='sm' p='5' rounded='xl' width="100%">
                <Flex direction="row" alignItems="center">
                    <WrapItem>
                        <Avatar size='xl' name='User name' src='https://bit.ly/code-beast'/>
                    </WrapItem>

                    <Flex direction="column" justifyContent="space-between" ml={5}>
                        <Text>Product Manager</Text>
                        <Text fontWeight='bold' fontSize='xl'>Cristiano Hawkins</Text>
                    </Flex>
                </Flex>
            </Box>

            <SimpleGrid columns={2} spacing={5} mt={5}>
                <Box boxShadow='sm' rounded='xl' p='5'>
                    <Flex>
                        <Text fontWeight='bold'>About</Text>
                    </Flex>

                    <Flex alignItems='center' mt={5}>
                        <Icon as={FiPhone} w={5} h={5} mr={2}/>
                        <Text>(370) 5 219 3400</Text>
                    </Flex>

                    <Flex alignItems='center' mt={3}>
                        <Icon as={FiInbox} w={5} h={5} mr={2}/>
                        <Text>example@gmail.com</Text>
                    </Flex>

                    <Flex alignItems='center' mt={3}>
                        <Icon as={FiMapPin} w={5} h={5} mr={2}/>
                        <Text>Kaunas, Lituania</Text>
                    </Flex>
                </Box>

                <Box boxShadow='sm' rounded='xl' p='5'>
                    <Flex>
                        <Text fontWeight='bold'>Skills</Text>
                    </Flex>

                    <Box mt={5}>
                        {skills.map((skill) => (
                            <Tag
                                size='md'
                                key={skill.id}
                                borderRadius='full'
                                variant='solid'
                                colorScheme={skill.color}
                                mb={2}
                                mr={1}
                            >
                                <TagLabel>{skill.name}</TagLabel>
                            </Tag>
                        ))}
                    </Box>
                </Box>
            </SimpleGrid>

        </Flex>
    )
}