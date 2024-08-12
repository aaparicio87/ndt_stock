import { Outlet } from "react-router-dom"
import { StaffProvider } from "../../../context/StaffContext"


export const Users = () => {
    return (
        <StaffProvider>
            <Outlet />
        </StaffProvider>
    )
}
