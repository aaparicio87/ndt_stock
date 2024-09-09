import React from "react";
import { Avatar, Box, Button, Flex, HStack, Icon, SimpleGrid, Tag, TagLabel, Text, WrapItem } from "@chakra-ui/react";
import { FiInbox } from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrUserCert } from "../../../../../state/features/auth/authSlice";
import { COLORS_DEGREE } from "../../../../../utils/constants";
import ModalEditProfile from "../ModalEditProfile/ModalEditProfile";
import { capitalizeFirstLetter } from "../../../../../utils/functions";


const General = () => {

    const user = useSelector(selectCurrentUser);
    const certificates = useSelector(selectCurrUserCert);

    const [isOpen, setIsOpen] = React.useState(false)

    const onClose = () => setIsOpen(false)

    if (!user) {
        return null
    }


    return (
        <Flex direction="column">

            <Box boxShadow='sm' p='5' rounded='xl' width="100%" as={Flex} justifyContent={'space-between'} direction={'row'}>
                <Flex direction="row" alignItems="center">
                    <WrapItem>
                        <Avatar size='xl' name={`${capitalizeFirstLetter(user.name)} ${capitalizeFirstLetter(user.lastName)}`} src={user.photoUrl} />
                    </WrapItem>

                    <Flex direction="column" justifyContent="space-between" ml={5}>
                        <Text fontWeight='bold' fontSize='xl'>{`${capitalizeFirstLetter(user.name)} ${capitalizeFirstLetter(user.lastName)}`}</Text>
                    </Flex>
                </Flex>
                <Button
                    colorScheme='teal'
                    variant='solid'
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    Edit Profile
                </Button>
            </Box>

            <SimpleGrid columns={2} spacing={5} mt={5}>
                <Box boxShadow='sm' rounded='xl' p='5'>
                    <Flex>
                        <Text fontWeight='bold'>About</Text>
                    </Flex>

                    {/*  <Flex alignItems='center' mt={5}>
                        <Icon as={FiPhone} w={5} h={5} mr={2} />
                        <Text>(370) 5 219 3400</Text>
                    </Flex> */}

                    <Flex alignItems='center' mt={3}>
                        <Icon as={FiInbox} w={5} h={5} mr={2} />
                        <Text>{user.email}</Text>
                    </Flex>

                    {/* <Flex alignItems='center' mt={3}>
                        <Icon as={FiMapPin} w={5} h={5} mr={2} />
                        <Text>Kaunas, Lituania</Text>
                    </Flex> */}
                </Box>

                <Box boxShadow='sm' rounded='xl' p='5'>
                    <Flex>
                        <Text fontWeight='bold'>Skills</Text>
                    </Flex>

                    <Box mt={5}>

                        <Tag
                            size='md'
                            key={user.degree ?? new Date().toTimeString()}
                            borderRadius='full'
                            variant='solid'
                            colorScheme={user.degree ? COLORS_DEGREE[user.degree] : 'white'}
                            mb={2}
                            mr={1}
                        >
                            <TagLabel>{user.degree}</TagLabel>
                        </Tag>

                    </Box>
                </Box>
                <Box boxShadow='sm' rounded='xl' p='5'>
                    <Flex>
                        <Text fontWeight='bold'>Certificates</Text>
                    </Flex>

                    <Box mt={5}>
                        <HStack spacing={4}>
                            {
                                certificates?.map((cert, index) => (
                                    <Tag
                                        size='md'
                                        key={index}
                                    >
                                        <TagLabel fontWeight={'bold'}>{cert}</TagLabel>
                                    </Tag>
                                ))
                            }
                        </HStack>
                    </Box>
                </Box>
            </SimpleGrid>
            <ModalEditProfile
                isOpen={isOpen}
                onClose={onClose}
                user={user}

            />
        </Flex>
    )
}

export default General