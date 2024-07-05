import { Outlet } from 'react-router-dom'
import {WorkProvider} from "../../../context/WorkContext.tsx";


export const Works = () => {

    return (
        <WorkProvider>
            <Outlet />
        </WorkProvider>
    )
}
