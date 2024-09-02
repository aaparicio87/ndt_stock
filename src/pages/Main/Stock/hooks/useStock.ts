import React, { ChangeEvent } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { useNotification } from "../../../../hooks/useNotification";
import { collection, onSnapshot } from "firebase/firestore";
import { FB_DB } from "../../../../config/firebase.conf";
import { STOCK, TRADEMARK, TYPE_EQUIPMENTS } from "../../../../utils/constants";
import {
  createNewStockElement,
  deleteStockElement,
  getAllStcokElements,
  updateStockElement,
} from "../../../../services";
import { zodResolver } from "@hookform/resolvers/zod";
import { STOCK_VALIDATION_SCHEMA } from "../../../../utils/validationSchemas";
import {
  FieldErrors,
  useForm,
  UseFormClearErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

export interface IUseStock {
  handleViewDetails: (item: TStock) => void;
  handleEdit: (item: TStock) => void;
  handleDelete: (item: TStock) => void;
  handleConfirmDelete: () => Promise<void>;
  isOpen: boolean;
  isOpenDetail: boolean;
  onCloseDetail: () => void;
  isOpenDelete: boolean;
  stockElement: TStock | undefined;
  data: TStock[];
  onOpen: () => void;
  onCloseDelete: () => void;
  isLoading: boolean;
  register: UseFormRegister<TInitialState>;
  errors: FieldErrors<TInitialState>;
  isSubmitting: boolean;
  handleCreate: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleChangeTypeEquipment: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleChangeTrademark: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCancelAdd: () => void;
  closeDetails: () => void;
  handleCancelDelete: () => void;
  clearErrors: UseFormClearErrors<TInitialState>;
  watch: UseFormWatch<TInitialState>;
}

type TInitialState = TStock & {
  otherTypeEquipment: string;
  otherTrademark: string;
};

const INITIAL_STATE: TInitialState = {
  serialNumber: "",
  model: "",
  typeEquipment: "",
  tradeMark: "",
  store: "",
  calibrationDate: new Date().toISOString().split("T")[0],
  qualityOfService: "",
  remarks: "",
  otherTypeEquipment: "",
  otherTrademark: "",
};

export const useStock = (): IUseStock => {
  const { openToast } = useNotification();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDetail,
    onOpen: onOpenDetail,
    onClose: onCloseDetail,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const [stockElement, setStockElement] = React.useState<TStock | undefined>(
    undefined,
  );
  const [stockElementDelete, setStockElementDelete] = React.useState<
    TStock | undefined
  >(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<TStock[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    clearErrors,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<TInitialState>({
    defaultValues: INITIAL_STATE,
    resolver: zodResolver(STOCK_VALIDATION_SCHEMA),
  });

  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(FB_DB, STOCK), (_) => {
      getAllElements();
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    reset(INITIAL_STATE);
  }, [isSubmitSuccessful]);

  const getAllElements = async () => {
    setIsLoading((prev) => !prev);
    try {
      const stockData = await getAllStcokElements();
      setData(stockData);
    } catch (error) {
      openToast("error", (error as Error).message, "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeTypeEquipment = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setValue("typeEquipment", selectedValue);

    if (selectedValue !== "others") {
      setValue("otherTypeEquipment", "");
    }
  };

  const handleChangeTrademark = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setValue("tradeMark", selectedValue);

    if (selectedValue !== "others") {
      setValue("otherTrademark", "");
    }
  };

  const handleCancelAdd = () => {
    reset(INITIAL_STATE);
    onClose();
  };

  const handleCancelDelete = () => {
    setStockElementDelete(undefined);
    onCloseDelete();
  };

  const handleViewDetails = (item: TStock) => {
    setStockElement(item);
    onOpenDetail();
  };

  const closeDetails = () => {
    setStockElement(undefined);
    onCloseDetail();
  };

  const handleEdit = (item: TStock) => {
    setIsLoading(true);
    reset(item);
    const isOtherTypeEquipment = !TYPE_EQUIPMENTS.includes(item.typeEquipment);
    const isOtherTradeMark = !TRADEMARK.includes(item.tradeMark);

    if (isOtherTypeEquipment) {
      setValue("typeEquipment", "others");
      setValue("otherTypeEquipment", item.typeEquipment);
    } else {
      setValue("typeEquipment", item.typeEquipment);
      setValue("otherTypeEquipment", "");
    }

    if (isOtherTradeMark) {
      setValue("tradeMark", "others");
      setValue("otherTrademark", item.tradeMark);
    } else {
      setValue("tradeMark", item.tradeMark);
      setValue("otherTrademark", "");
    }
    onOpen();
    setIsLoading(false);
  };

  const handleDelete = (item: TStock) => {
    setStockElementDelete(item);
    onOpenDelete();
  };

  const handleConfirmDelete = async () => {
    try {
      if (stockElementDelete?.uid) {
        await deleteStockElement(stockElementDelete.uid);
        openToast("success", "Element deleted successfully", "Success");
      }
    } catch (error) {
      openToast("error", (error as Error).message, "Error");
    } finally {
      setStockElementDelete(undefined);
      onCloseDelete();
    }
  };

  const handleCreate = handleSubmit(async () => {
    const create = getValues();
    const isOtherTypeEquipment = create.typeEquipment === "others";
    const isOtherTradeMark = create.tradeMark === "others";

    try {
      const dataToSubmit: TStock = {
        ...create,
        typeEquipment: isOtherTypeEquipment
          ? create.otherTypeEquipment
          : create.typeEquipment,
        tradeMark: isOtherTradeMark ? create.otherTrademark : create.tradeMark,
      };
      if (create.uid) {
        await updateStockElement(create.uid, dataToSubmit);
        openToast("success", "Element updated successfully", "Success");
      } else {
        await createNewStockElement(dataToSubmit);
        openToast("success", "New element added to the stock", "Success");
      }
    } catch (error) {
      openToast("error", (error as Error).message, "Error");
    } finally {
      onClose();
    }
  });

  return {
    handleViewDetails,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    isOpen,
    isOpenDetail,
    onCloseDetail,
    isOpenDelete,
    stockElement,
    data,
    onOpen,
    onCloseDelete,
    isLoading,
    register,
    errors,
    isSubmitting,
    handleCreate,
    handleChangeTypeEquipment,
    handleChangeTrademark,
    handleCancelAdd,
    closeDetails,
    handleCancelDelete,
    clearErrors,
    watch,
  };
};
