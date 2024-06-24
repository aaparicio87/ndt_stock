import { FB_DB } from "../config/firebase.conf";
import { STOCK } from "../utils/constants";
import FirebaseService from "./firebase.services";


const stockService = new FirebaseService<TStock>(FB_DB, STOCK);

const createNewStockElement = async(data: TStock) => {
    await stockService.create(data);
}

const getAllStcokElements = async () => {
    return await stockService.getAll();
}

const getStockByUID = async(uid:string) => {
    return await stockService.getByUID(uid);
}

const updateStockElement = async (uid: string, data: TStock) => {
    await stockService.update(uid, data);
};

const deleteStockElement = async (uid: string) => {
    await stockService.delete(uid);
};

export {
    getAllStcokElements,
    createNewStockElement,
    getStockByUID,
    updateStockElement,
    deleteStockElement,
}