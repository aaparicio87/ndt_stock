import React, { createContext, useContext } from "react";
import {
  IWorkedHoursHooks,
  useWorkedHours,
} from "../pages/Main/WorkedHours/hooks/useWorkedHours.ts";

type Props = {
  children: React.ReactNode;
};

const WorkedHoursContext = createContext<IWorkedHoursHooks | null>(null);

const WorkedHoursProvider = ({ children }: Props) => {
  const {
    certificatesList,
    customersList,
    handleChangeCustomersSelect,
    handleChangeItemCertificates,
    itemsCertificates,
    customerSelected,
    register,
    errors,
    isSubmitting,
    handleCreateWorkHour,
    isOpen,
    initialRef,
    finalRef,
    onOpen,
    openToast,
    handleWorkHoursSelected,
    workHourSelected,
    handleGetWorkHoursByUser,
    userWorkHours,
    handleCloseModal,
    onViewChange,
    visibleHours,
    onNavigate,
    showTraveling,
    handleToogleTraveling,
    clearErrors,
    handleOpenEditWorkHour,
    isLoading,
    watch,
  } = useWorkedHours();

  return (
    <WorkedHoursContext.Provider
      value={{
        certificatesList,
        customersList,
        handleChangeCustomersSelect,
        handleChangeItemCertificates,
        itemsCertificates,
        customerSelected,
        register,
        errors,
        isSubmitting,
        handleCreateWorkHour,
        isOpen,
        initialRef,
        finalRef,
        onOpen,
        openToast,
        handleWorkHoursSelected,
        workHourSelected,
        handleGetWorkHoursByUser,
        userWorkHours,
        handleCloseModal,
        onViewChange,
        visibleHours,
        onNavigate,
        showTraveling,
        handleToogleTraveling,
        clearErrors,
        handleOpenEditWorkHour,
        isLoading,
        watch,
      }}
    >
      {children}
    </WorkedHoursContext.Provider>
  );
};

function useWorkedHoursContext() {
  const context = useContext(WorkedHoursContext);
  if (!context) {
    throw new Error(
      "useWorkedHoursContext must be used within a WorkedHoursContext",
    );
  }
  return context;
}

export { WorkedHoursProvider, useWorkedHoursContext };
