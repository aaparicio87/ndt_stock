import React from 'react';
import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuGroup,
    MenuItem,
    MenuList,
} from '@chakra-ui/react'
import {
    FiChevronDown,
    FiFilter
} from "react-icons/fi";

type TProps = {
    name: string
    titleGroup: string
    children: React.ReactNode;
    onClose?: () => void
}

export const MenuFilter = ({
    name,
    titleGroup,
    children,
    onClose = () => { }
}: TProps) => {
    return (
        <Menu autoSelect={false} onClose={onClose}>
            <MenuButton
                as={Button}
                leftIcon={<FiFilter />}
                rightIcon={<FiChevronDown />}
                colorScheme='teal'
                variant='outline'
                size={'sm'}
                fontSize={'medium'}
            >
                {name}
            </MenuButton>
            <MenuList>
                <MenuGroup title={titleGroup}>
                    <MenuItem>
                        <Box onClick={(e) => e.stopPropagation()} onFocus={(e) => e.stopPropagation()} w={'90%'}>
                            {children}
                        </Box>
                    </MenuItem>
                </MenuGroup>
            </MenuList>
        </Menu>
    )
}
