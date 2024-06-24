import { Routes, Route } from 'react-router-dom'
import { PrivateOutlet } from '../utils/PrivateOutlet'
import { Forgot, Login } from '../pages/Auth'

import { AuthLayout, MainLayout } from '../layout'
import { Profile, Stock, Users } from '../pages/Main'
import WorkedHours from '../pages/Main/WorkedHours/WorkedHours'
import Works from '../pages/Main/Works/Works'
import WorksTable from '../pages/Main/Works/components/WorksTable/WorksTable'
import CreaterWork from '../pages/Main/Works/components/CreateWork/CreaterWork'
import EditWork from '../pages/Main/Works/components/EditWork/EditWork'


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
                    <Route path="whours" element={<WorkedHours />} />
                    <Route path="works" element={<Works />}>
                        <Route index element={<WorksTable />} />
                        <Route path="create" element={<CreaterWork />} />
                        <Route path="edit/:id" element={<EditWork />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}

export default MainRoutes