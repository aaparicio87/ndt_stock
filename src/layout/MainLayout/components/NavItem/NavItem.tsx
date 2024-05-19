import React from "react";
import { Flex, FlexProps, Icon, Link as ChakraLink } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { Link as ReactRouterLink } from "react-router-dom";


type NavItemProps = FlexProps & {
    icon: IconType;
    children: React.ReactNode;
}
export const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
    return (
        <ChakraLink
            as={ReactRouterLink}
            to='/'
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
        >
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
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