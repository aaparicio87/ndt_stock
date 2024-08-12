import React, { createContext, useContext } from "react";
import { IUseUser, useUser } from "../pages/Main/Users/hooks/useUsers";
type Props = {
    children: React.ReactNode
}


const StaffContext = createContext<IUseUser | null>(null)


const StaffProvider = ({ children }: Props) => {
    const {
        certificatesList,
        closeModalAdd,
        data,
        handleConfirmDelete,
        handleDelete,
        handleEdit,
        handleFilterUsers,
        handleGetAllCertificates,
        handleUserHours,
        handleViewDetails,
        isLoading,
        isOpen,
        isOpenDelete,
        isOpenDetail,
        onCloseDelete,
        onOpen,
        openWorksUser,
        setValue,
        staffElement,
        user,
        userWorkHours,
        register,
        errors,
        isSubmitting,
        isSubmitSuccessful,
        resetField,
    } = useUser()

    return (
        <StaffContext.Provider
            value={{
                certificatesList,
                closeModalAdd,
                data,
                handleConfirmDelete,
                handleDelete,
                handleEdit,
                handleFilterUsers,
                handleGetAllCertificates,
                handleUserHours,
                handleViewDetails,
                isLoading,
                isOpen,
                isOpenDelete,
                isOpenDetail,
                onCloseDelete,
                onOpen,
                openWorksUser,
                setValue,
                staffElement,
                user,
                userWorkHours,
                register,
                errors,
                isSubmitting,
                isSubmitSuccessful,
                resetField,
            }}
        >
            {children}
        </StaffContext.Provider>
    )
}

function useStaffContext() {
    const context = useContext(StaffContext)
    if (!context) {
        throw new Error(
            'useStaffContext must be used within a StaffContext'
        )
    }
    return context
}

export { StaffProvider, useStaffContext }
