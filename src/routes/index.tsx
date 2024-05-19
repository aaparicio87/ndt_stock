import { Routes, Route } from 'react-router-dom'
import { PrivateOutlet } from '../utils/PrivateOutlet'
import { Forgot, Login } from '../pages/Auth'
import { Profile, Stock } from '../pages/Main'
import { AuthLayout, MainLayout } from '../layout'


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
                </Route>
            </Route>
        </Routes>
    )
}

export default MainRoutes