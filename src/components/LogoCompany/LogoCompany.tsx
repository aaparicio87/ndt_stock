import {
    Link as ChakraLink,
    Image,
    ImageProps,
} from "@chakra-ui/react";
import Logo from '../../assets/logo.png'

import { Link as ReactRouterLink } from "react-router-dom";

type TProps = {
    route: string
    display?: ImageProps['display'];
    boxSize?: ImageProps['boxSize'];
}

export const LogoCompany = ({ route, display, boxSize }: TProps) => {
    return (
        <ChakraLink as={ReactRouterLink} to={route} display={display}>
            <Image src={Logo} alt='Logo' display={display} boxSize={boxSize} />
        </ChakraLink>
    )
}
