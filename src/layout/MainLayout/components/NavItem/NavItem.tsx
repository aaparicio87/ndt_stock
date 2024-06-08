import React from "react";
import { Flex, FlexProps, Icon, Link as ChakraLink } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { Link as ReactRouterLink } from "react-router-dom";


type NavItemProps = FlexProps & {
    icon: IconType;
    route: string
    children: React.ReactNode;
}
export const NavItem = ({ icon, route, children, ...rest }: NavItemProps) => {
    return (
        <ChakraLink
            as={ReactRouterLink}
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
            to={route}
        >
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'teal',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </ChakraLink>
    );
};