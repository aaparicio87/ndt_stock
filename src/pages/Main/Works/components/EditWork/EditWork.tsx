import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import WorkForm from "../WorkForm/WorkForm.tsx";
import { useWorkContext } from "../../../../../context/WorkContext.tsx";



const EditWork = () => {

    const {
        handleSelectOptions,
    } = useWorkContext()

    React.useEffect(() => {
        (async () => await handleSelectOptions())()
    }, []);

    return (
        <Box borderWidth='1px' borderRadius='lg' overflow='hidden' padding={10} m={10}>
            <Heading
                as='h3'
                size='lg'
                noOfLines={1}
            >
                Edit work
            </Heading>

            <WorkForm />
        </Box>
    )
}

export default EditWork
