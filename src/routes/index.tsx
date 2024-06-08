import { Routes, Route } from 'react-router-dom'
import { PrivateOutlet } from '../utils/PrivateOutlet'
import { Forgot, Login } from '../pages/Auth'

import { AuthLayout, MainLayout } from '../layout'
import { Profile, Stock, Users } from '../pages/Main'
import WorkedHours from '../pages/Main/WorkedHours/WorkedHours'


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
                </Route>
            </Route>
        </Routes>
    )
}

export default MainRoutes