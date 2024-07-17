import { FB_DB } from "../config/firebase.conf";
import { STOCK } from "../utils/constants";
import FirebaseService from "./firebase.services";


const stockService = new FirebaseService<TStock>(FB_DB, STOCK);

const createNewStockElement = async(data: TStock) => {
    try {
        await stockService.create(data);
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

const getAllStcokElements = async () => {
    try {     
        return await stockService.getAll();
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

const getStockByUID = async(uid:string) => {
    try {
        return await stockService.getByUID(uid);
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

const updateStockElement = async (uid: string, data: TStock) => {
    try {     
        await stockService.update(uid, data);
    } catch (error) {
        throw new Error((error as Error).message)
    }
};

const deleteStockElement = async (uid: string) => {
    try {
        await stockService.delete(uid);
    } catch (error) {
        throw new Error((error as Error).message)
    }
};

export {
    getAllStcokElements,
    createNewStockElement,
    getStockByUID,
    updateStockElement,
    deleteStockElement,
}