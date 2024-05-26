import {
    Box,
    BoxProps,
    CloseButton,
    Flex,
    useColorModeValue,
} from "@chakra-ui/react";
import { IconType } from 'react-icons';
import {
    FiUsers,
    FiFileText,
} from "react-icons/fi";
import { NavItem } from "../NavItem/NavItem";
import { LogoCompany } from "../../../../components";

interface LinkItemProps {
    name: string
    icon: IconType
    route: string
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Stock', icon: FiFileText, route: '/' },
    { name: 'Users', icon: FiUsers, route: 'users' },
];

type SidebarProps = BoxProps & {
    onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <LogoCompany route="/" />
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem
                    key={link.name}
                    icon={link.icon}
                    route={link.route}
                >
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};