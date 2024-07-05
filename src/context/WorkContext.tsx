import React, { createContext, useContext } from "react";
import {IWorkHook, useWorks} from "../pages/Main/Works/hooks/useWorks.ts";
type Props = {
    children: React.ReactNode
}


const WorkContext = createContext<IWorkHook  | null>(null)


const WorkProvider = ({ children }: Props) => {
    const {
        isLoading,
        data,
        openEditWork,
        handleDelete,
        openAddWork,
        isOpenDelete,
        onCloseDelete,
        handleConfirmDelete,
        workersList,
        handleGetAllStaff,
        handleGetAllCustomers,
        handleGetAllCertificates,
        certificatesList,
        customersList,
        openWorksTable,
        openViewDetail,
        handleGetElementDetail,
        workElementDetail,
        handleChangeWorkersSelect,
        handleChangeCustomersSelect,
        handleChangeItemCertificates,
        workersSelected,
        itemsCertificates,
        customerSelected,
        register,
        errors,
        isSubmitting,
        handleCancel,
        handleCreateUpdateWork,
        handleSelectOptions,
        getAllElements,
    } = useWorks()

    return (
        <WorkContext.Provider
            value={{
                isLoading,
                data,
                openEditWork,
                handleDelete,
                openAddWork,
                isOpenDelete,
                onCloseDelete,
                handleConfirmDelete,
                workersList,
                handleGetAllStaff,
                handleGetAllCustomers,
                handleGetAllCertificates,
                certificatesList,
                customersList,
                openWorksTable,
                openViewDetail,
                handleGetElementDetail,
                workElementDetail,
                handleChangeWorkersSelect,
                handleChangeCustomersSelect,
                handleChangeItemCertificates,
                workersSelected,
                itemsCertificates,
                customerSelected,
                register,
                errors,
                isSubmitting,
                handleCancel,
                handleCreateUpdateWork,
                handleSelectOptions,
                getAllElements,
            }}
        >
            {children}
        </WorkContext.Provider>
    )
}

function useWorkContext() {
    const context = useContext(WorkContext)
    if (!context) {
        throw new Error(
            'useWorkContext must be used within a WorkContext'
        )
    }
    return context
}

export { WorkProvider, useWorkContext }
