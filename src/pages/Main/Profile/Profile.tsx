import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import General from "./components/General/General"
import Security from "./components/Security/Security"


export const Profile = () => {
    return (
        <Tabs>
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
    )
}