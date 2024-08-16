import {
    Box,
    Tooltip,
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
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../state/features/auth/authSlice";
import { NAMES, ROUTES } from "../../../../utils/constants.ts";

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


export const SidebarContent = () => {
    const user = useSelector(selectCurrentUser);

    const LINKS_PERMISSIONS = LinkItems.map((link) => {
        //Only Admins and Data Managers can manage Users
        if (link.name === NAMES.USERS) {
            return { ...link, visible: user?.roles.some((rol) => rol === 'ADMINISTRATOR' || rol === 'DATA_MANAGER') }
        }
        return link
    })

    return (
        <Box
            bg={useColorModeValue('#29363c', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            pos="fixed"
            h="full"
            mt={20}
            pt={10}
        >
            {LINKS_PERMISSIONS.map((link) => {
                if (!link.visible) return
                return (
                    <NavItem
                        key={link.name}
                        icon={link.icon}
                        route={link.route}
                        color={'white'}
                    >
                        {link.name}
                    </NavItem>
                )
            })}
        </Box>
    );
};
