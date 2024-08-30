import React, { createContext, useContext } from "react";
import { IUseUser, useUser } from "../pages/Main/Users/hooks/useUsers";

type Props = {
  children: React.ReactNode;
};

const StaffContext = createContext<IUseUser | null>(null);

const StaffProvider = ({ children }: Props) => {
  const {
    handleViewDetails,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    closeModalAdd,
    user,
    isOpenDelete,
    staffElement,
    data,
    onOpen,
    isOpen,
    isOpenDetail,
    onCloseDelete,
    isLoading,
    certificatesList,
    handleGetAllCertificates,
    handleUserHours,
    userWorkHours,
    openWorksUser,
    errorsFilter,
    isSubmitingFilter,
    registerFilter,
    setValueFilter,
    handleFilterUsers,
    isSubmitSuccessful,
    resetFieldFilter,
    loading,
    itemsCertificates,
    handleImageChange,
    itemsRoles,
    selectedImage,
    onSubmitUser,
    errors,
    isSubmitting,
    register,
    onChangeItemCertificates,
    onChangeItemRoles,
    certificatesDetails,
    clearErrors,
  } = useUser();

  return (
    <StaffContext.Provider
      value={{
        handleViewDetails,
        handleEdit,
        handleDelete,
        handleConfirmDelete,
        closeModalAdd,
        user,
        isOpenDelete,
        staffElement,
        data,
        onOpen,
        isOpen,
        isOpenDetail,
        onCloseDelete,
        isLoading,
        certificatesList,
        handleGetAllCertificates,
        handleUserHours,
        userWorkHours,
        openWorksUser,
        errorsFilter,
        isSubmitingFilter,
        registerFilter,
        setValueFilter,
        handleFilterUsers,
        isSubmitSuccessful,
        resetFieldFilter,
        loading,
        itemsCertificates,
        handleImageChange,
        itemsRoles,
        selectedImage,
        onSubmitUser,
        errors,
        isSubmitting,
        register,
        onChangeItemCertificates,
        onChangeItemRoles,
        certificatesDetails,
        clearErrors,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

function useStaffContext() {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaffContext must be used within a StaffContext");
  }
  return context;
}

export { StaffProvider, useStaffContext };
