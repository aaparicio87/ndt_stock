import React, { createContext, useContext } from "react";
import { IUseStock, useStock } from "../pages/Main/Stock/hooks/useStock";

type Props = {
  children: React.ReactNode;
};

const StockContext = createContext<IUseStock | null>(null);

const StockProvider = ({ children }: Props) => {
  const {
    handleViewDetails,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    isOpen,
    handleCancelAdd,
    isOpenDetail,
    onCloseDetail,
    isOpenDelete,
    stockElement,
    data,
    onOpen,
    onCloseDelete,
    isLoading,
    errors,
    handleChangeTrademark,
    handleChangeTypeEquipment,
    handleCreate,
    isSubmitting,
    register,
    closeDetails,
    handleCancelDelete,
    clearErrors,
    watch,
  } = useStock();

  return (
    <StockContext.Provider
      value={{
        handleViewDetails,
        handleEdit,
        handleDelete,
        handleConfirmDelete,
        isOpen,
        handleCancelAdd,
        isOpenDetail,
        onCloseDetail,
        isOpenDelete,
        stockElement,
        data,
        onOpen,
        onCloseDelete,
        isLoading,
        errors,
        handleChangeTrademark,
        handleChangeTypeEquipment,
        handleCreate,
        isSubmitting,
        register,
        closeDetails,
        handleCancelDelete,
        clearErrors,
        watch,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

function useStockContext() {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStockContext must be used within a StockContext");
  }
  return context;
}

export { StockProvider, useStockContext };
