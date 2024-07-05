import React from "react";
import {Container, Heading} from "@chakra-ui/react";
import WorkForm from "../WorkForm/WorkForm.tsx";
import {useWorkContext} from "../../../../../context/WorkContext.tsx";



const EditWork = () => {

    const {
        handleSelectOptions,
    } = useWorkContext()

    React.useEffect(() => {
        (async() => await handleSelectOptions())()
    }, []);

    return (
        <Container maxW={'3xl'}>
            <Heading
                as='h3'
                size='lg'
                noOfLines={1}
            >
                Edit work
            </Heading>

            <WorkForm/>
        </Container>
    )
}

export default EditWork
