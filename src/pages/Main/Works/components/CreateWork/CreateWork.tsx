import React from "react";
import {Container, Heading
} from '@chakra-ui/react'
import WorkForm from "../WorkForm/WorkForm.tsx";
import {useWorkContext} from "../../../../../context/WorkContext.tsx";


const CreateWork = () => {
    const { handleSelectOptions } = useWorkContext()

    React.useEffect(() => {
        (async() => {
            await handleSelectOptions()
        })()
    }, []);

    return (
        <Container maxW={'3xl'}>
            <Heading
                as='h3'
                size='lg'
                noOfLines={1}
            >
                Create a new work
            </Heading>

            <WorkForm/>
        </Container>
    )
}

export default CreateWork
