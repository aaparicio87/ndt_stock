import { Routes, Route } from 'react-router-dom'
import { PrivateOutlet } from '../utils/PrivateOutlet'
import { Forgot, Login } from '../pages/Auth'

import { AuthLayout, MainLayout } from '../layout'
import { Profile, Stock, Users, Works } from '../pages/Main'
import WorkedHours from '../pages/Main/WorkedHours/WorkedHours'
import WorksTable from '../pages/Main/Works/components/WorksTable/WorksTable'
import EditWork from '../pages/Main/Works/components/EditWork/EditWork'
import DetailWork from '../pages/Main/Works/components/DetailWork/DetailWork'
import CreateWork from "../pages/Main/Works/components/CreateWork/CreateWork.tsx";
import {WorkedHoursProvider} from "../context/WorkedHoursContext.tsx";


const MainRoutes = () => {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot" element={<Forgot />} />
            </Route>
            <Route path="*" element={<PrivateOutlet />}>
                <Route element={<MainLayout />}>
                    <Route index element={<Stock />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="users" element={<Users />} />
                    <Route path="whours" element={
                        <WorkedHoursProvider>
                            <WorkedHours />
                        </WorkedHoursProvider>
                    } />
                    <Route path="works" element={<Works />}>
                        <Route index element={<WorksTable />} />
                        <Route path="create" element={<CreateWork />} />
                        <Route path="edit/:id" element={<EditWork />} />
                        <Route path="detail/:id" element={<DetailWork />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}

export default MainRoutes
