import React, { createContext, useContext } from "react";
import { IUsecertificates, useCertificates } from "../pages/Main/Certificates/hooks/useCertificates";

type Props = {
    children: React.ReactNode
}


const CertificatesContext = createContext<IUsecertificates | null>(null)


const CertificatesProvider = ({ children }: Props) => {
    const {
        data,
        isLoading,
        isOpenDelete,
        isOpen,
        handleConfirmDelete,
        handleDelete,
        register,
        errors,
        isSubmitting,
        certificate,
        handleEdit,
        handleSubmitCertificate,
        onCloseEdit,
        onCloseDeleteDialog,
        onOpen
    } = useCertificates()

    return (
        <CertificatesContext.Provider
            value={{
                data,
                isLoading,
                isOpenDelete,
                isOpen,
                handleConfirmDelete,
                handleDelete,
                register,
                errors,
                isSubmitting,
                certificate,
                handleEdit,
                handleSubmitCertificate,
                onCloseEdit,
                onCloseDeleteDialog,
                onOpen
            }}
        >
            {children}
        </CertificatesContext.Provider>
    )
}

function useCertificatesContext() {
    const context = useContext(CertificatesContext)
    if (!context) {
        throw new Error(
            'useCertificatesContext must be used within a CertificatesContext'
        )
    }
    return context
}

export { CertificatesProvider, useCertificatesContext }