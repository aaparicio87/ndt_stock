import {
    Avatar,
    Box,
    Flex,
    FlexProps,
    HStack,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue,
    VStack
} from "@chakra-ui/react";
import {
    FiChevronDown,
} from "react-icons/fi";
import { LogoCompany } from "../../../../components";
import { useAuth } from "../../../../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../state/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../../../../utils/functions";

type MobileProps = FlexProps & {
    onOpen: () => void;
}
export const MobileNav = ({ onOpen, ...rest }: MobileProps) => {

    const { name, lastName, photoUrl } = useSelector(selectCurrentUser) as TStaff
    const { logout } = useAuth()
    const navigate = useNavigate()

    return (
        <Flex
            px={{ base: 4, md: 4 }}
            height={20}
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={'space-between'}
            position={'sticky'}
            top={0}
            zIndex={50}
            {...rest}
        >

            <LogoCompany route="/" />

            <HStack>
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={photoUrl}
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{`${capitalizeFirstLetter(name)} ${capitalizeFirstLetter(lastName)}`}</Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem onClick={() => navigate('profile')}>Profile</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={logout}>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};