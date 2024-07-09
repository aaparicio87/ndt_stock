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
import {NAMES, ROUTES} from "../../../../utils/constants.ts";

interface LinkItemProps {
    name: string
    icon: IconType
    route: string
    visible: boolean
}
const LinkItems: Array<LinkItemProps> = [
    { name: NAMES.STOCK, icon: FiFileText, route: ROUTES.STOCK, visible: true },
    { name: NAMES.USERS, icon: FiUsers, route: ROUTES.USERS, visible: true },
    { name: NAMES.WORKS, icon: FiBriefcase, route: ROUTES.WORKS, visible: true },
    { name: NAMES.WORKED_HOURS, icon: FiWatch, route: ROUTES.WORKED_HOURS, visible: true },
];

type SidebarProps = BoxProps & {
    onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const user = useSelector(selectCurrentUser);

    const LINKS_PERMISSIONS = LinkItems.map((link) => {
        if (link.name === NAMES.USERS) {
            return { ...link, visible: user?.roles.some((rol) => rol === 'ADMINISTRATOR' || rol === 'DATA_MANAGER') }
        }
        /*if (link.name === NAMES.WORKS) {
            return { ...link, visible: user?.roles.some((rol) => rol === 'ADMINISTRATOR') }
        }*/
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
