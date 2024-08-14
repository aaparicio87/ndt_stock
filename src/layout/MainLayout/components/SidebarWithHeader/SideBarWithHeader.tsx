import {
  Box,
  Drawer,
  DrawerContent,
  Flex,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import { SidebarContent } from "../SideBarContent/SideBarContent";
import { MobileNav } from "../MobileNav/MobileNav";

type Tprops = {
  children: React.ReactNode;
}

export function SidebarWithHeader({ children }: Tprops) {

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Flex flex="1" backgroundColor="gray.50" overflowX="auto">
        <Box ml={{ base: 0, md: 60 }} p="4" background={'white'} width="100%" >
          {children}
        </Box>
      </Flex>
    </Box>
  );
}