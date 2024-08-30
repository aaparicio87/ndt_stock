import React from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import {
  QOS,
  TRADEMARK,
  TYPE_EQUIPMENTS,
} from "../../../../../utils/constants";
import { useStockContext } from "../../../../../context/StockContext";

const ModalAdd = () => {
  const {
    isOpen,
    handleCancelAdd,
    stockElement,
    handleCreate,
    errors,
    register,
    isOtherTypeSelected,
    isOtherTradeMarkSelected,
    handleChangeTypeEquipment,
    handleChangeTrademark,
    isSubmitting,
    clearErrors,
  } = useStockContext();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={handleCancelAdd}
      size={"xl"}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <form onSubmit={handleCreate}>
        <ModalContent>
          <ModalHeader>
            {stockElement ? "Edit product" : "Create product"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack spacing={4}>
              <FormControl isInvalid={!!errors.serialNumber}>
                <FormLabel>Serial number</FormLabel>
                <Input
                  placeholder="Serial number"
                  {...register("serialNumber")}
                />
                <FormErrorMessage>
                  {errors.serialNumber && errors.serialNumber.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.model}>
                <FormLabel>Model</FormLabel>
                <Input placeholder="Model" {...register("model")} />
                <FormErrorMessage>
                  {errors.model && errors.model.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
            <HStack spacing={4} py={2}>
              <FormControl isInvalid={!!errors.typeEquipment}>
                <FormLabel>Type of equipment</FormLabel>
                <Select
                  onClick={() =>
                    errors.typeEquipment && clearErrors("typeEquipment")
                  }
                  placeholder="Select option"
                  {...register("typeEquipment")}
                  onChange={handleChangeTypeEquipment}
                  defaultValue={isOtherTypeSelected ? "others" : undefined}
                >
                  {TYPE_EQUIPMENTS.map((type, index) => (
                    <option value={type} key={index}>
                      {type}
                    </option>
                  ))}
                  <option value="others">Other</option>
                </Select>
                <FormErrorMessage>
                  {errors.typeEquipment && errors.typeEquipment.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.tradeMark} py={2}>
                <FormLabel>Trademark</FormLabel>
                <Select
                  onClick={() => errors.tradeMark && clearErrors("tradeMark")}
                  placeholder="Select option"
                  {...register("tradeMark")}
                  onChange={handleChangeTrademark}
                  defaultValue={isOtherTradeMarkSelected ? "others" : undefined}
                >
                  {TRADEMARK.map((type, index) => (
                    <option value={type} key={index}>
                      {type}
                    </option>
                  ))}
                  <option value="others">Other</option>
                </Select>

                <FormErrorMessage>
                  {errors.tradeMark && errors.tradeMark.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
            {(isOtherTypeSelected || isOtherTradeMarkSelected) && (
              <HStack spacing={4} py={2} width={"100%"} flex={1}>
                {isOtherTypeSelected && (
                  <FormControl
                    w={"50%"}
                    isInvalid={!!errors.otherTypeEquipment}
                  >
                    <Input
                      placeholder="Other type of equipment"
                      {...register("otherTypeEquipment")}
                    />
                    <FormErrorMessage>
                      {errors.otherTypeEquipment &&
                        errors.otherTypeEquipment.message}
                    </FormErrorMessage>
                  </FormControl>
                )}

                {isOtherTradeMarkSelected && (
                  <FormControl
                    w={"50%"}
                    ml={isOtherTradeMarkSelected ? "auto" : "0"}
                    isInvalid={!!errors.otherTrademark}
                  >
                    <Input
                      placeholder="Other trademark"
                      {...register("otherTrademark")}
                    />
                    <FormErrorMessage>
                      {errors.otherTrademark && errors.otherTrademark.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </HStack>
            )}
            <HStack spacing={4} py={2}>
              <FormControl isInvalid={!!errors.store}>
                <FormLabel>Store</FormLabel>
                <Input placeholder="Store" {...register("store")} />
                <FormErrorMessage>
                  {errors.store && errors.store.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.calibrationDate}>
                <FormLabel>Calibration</FormLabel>
                <Input
                  placeholder="Select Date and Time"
                  size="md"
                  type="date"
                  {...register("calibrationDate")}
                  onKeyDown={handleKeyDown}
                />
                <FormErrorMessage>
                  {errors.calibrationDate && errors.calibrationDate.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>

            <HStack spacing={4} pb={2}>
              <FormControl isInvalid={!!errors.qualityOfService}>
                <FormLabel>QoS</FormLabel>
                <Select
                  placeholder="Select option"
                  {...register("qualityOfService")}
                >
                  {QOS.map((type, index) => (
                    <option value={type} key={index}>
                      {type}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.qualityOfService && errors.qualityOfService.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.remarks}>
                <FormLabel>Remarks</FormLabel>
                <Input placeholder="Remarks" {...register("remarks")} />
                <FormErrorMessage>
                  {errors.remarks && errors.remarks.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              variant="solid"
              mr={3}
              type="submit"
              isLoading={isSubmitting}
            >
              {stockElement ? "Update" : "Save"}
            </Button>
            <Button onClick={handleCancelAdd} isDisabled={isSubmitting}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default ModalAdd;
