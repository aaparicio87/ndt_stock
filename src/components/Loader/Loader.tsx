import { Center, Spinner, SpinnerProps } from "@chakra-ui/react";

type TProps = SpinnerProps;

export const Loader = ({ size = "xl", ...props }: TProps) => {
    return (
        <Center>
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='teal'
                size={size}
                {...props}
            />
        </Center>
    );
};
