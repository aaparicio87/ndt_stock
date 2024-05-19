import { Outlet } from "react-router-dom";
import { SidebarWithHeader } from "./components";



export const MainLayout = () => {

    return (
        <SidebarWithHeader>
            <Outlet />
        </SidebarWithHeader>
    )
}
