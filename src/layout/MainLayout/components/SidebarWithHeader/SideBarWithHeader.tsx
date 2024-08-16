import {
  Box,
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

  const { onOpen, } = useDisclosure();
  return (
    <Box minH="95vh" bg={useColorModeValue('white', 'gray.50')}>
      <SidebarContent />
      <MobileNav onOpen={onOpen} />
      <Flex justifyContent={'center'} ml={50}>
        {children}
      </Flex>
    </Box>
  );
}