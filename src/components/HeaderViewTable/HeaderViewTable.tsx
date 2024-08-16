import { Heading, Stack } from '@chakra-ui/react'

type TProps = {
    name: string
    children?: React.ReactNode
}

export const HeaderViewTable = ({ name, children }: TProps) => {
    return (
        <Stack
            direction='row'
            spacing={4}
            flex={1}
            justifyContent={'space-between'}
            marginBottom={5}
        >
            <Heading
                as='h3'
                size='lg'
                noOfLines={1}
                ml={5}
            >
                {name}
            </Heading>
            {children}
        </Stack>
    )
}
