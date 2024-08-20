
import { Outlet } from 'react-router-dom'
import { CertificatesProvider } from '../../../context/CertificatesContext'

export const Certificates = () => {
    return (
        <CertificatesProvider>
            <Outlet />
        </CertificatesProvider>
    )
}
