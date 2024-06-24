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
    FiWatch,
    FiBriefcase
} from "react-icons/fi";
import { NavItem } from "../NavItem/NavItem";
import { LogoCompany } from "../../../../components";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../state/features/auth/authSlice";

interface LinkItemProps {
    name: string
    icon: IconType
    route: string
    visible: boolean
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Stock', icon: FiFileText, route: '/', visible: true },
    { name: 'Users', icon: FiUsers, route: 'users', visible: true },
    { name: 'Worked Hours', icon: FiWatch, route: 'whours', visible: true },
    { name: 'Works', icon: FiBriefcase, route: 'works', visible: true },
];

type SidebarProps = BoxProps & {
    onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const user = useSelector(selectCurrentUser);

    const LINKS_PERMISSIONS = LinkItems.map((link) => {
        if (link.name === 'Users') {
            return { ...link, visible: user?.roles.some((rol) => rol === 'ADMINISTRATOR') }
        }
        if (link.name === 'Worked Hours') {
            return { ...link, visible: user?.roles.some((rol) => rol === 'ADMINISTRATOR') }
        }
        return link
    })

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
            {LINKS_PERMISSIONS.map((link) => {
                if (!link.visible) return
                return (
                    <NavItem
                        key={link.name}
                        icon={link.icon}
                        route={link.route}
                    >
                        {link.name}
                    </NavItem>
                )
            })}
        </Box>
    );
};