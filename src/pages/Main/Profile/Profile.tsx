import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import General from "./components/General/General"
import Security from "./components/Security/Security"


export const Profile = () => {
    return (
        <Box overflow='hidden' m={10} padding={10} borderWidth='1px' borderRadius='lg' >
            <Tabs minH={'90vh'} minW={'80vw'}>
                <TabList>
                    <Tab>General</Tab>
                    <Tab>Security</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <General />
                    </TabPanel>
                    <TabPanel>
                        <Security />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}