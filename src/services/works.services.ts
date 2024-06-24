import { FB_DB } from "../config/firebase.conf";
import { WORKS } from "../utils/constants";
import FirebaseService from "./firebase.services";


const workService = new FirebaseService<TWork>(FB_DB, WORKS);


const createNewWorkElement = async(data: TStock) => {
    await workService.create(data);
}

const getAllWorks = async () => {
    return await workService.getAll();
}

const getWorkByUID = async(uid:string) => {
    return await workService.getByUID(uid);
}

const updateWorkElement = async (uid: string, data: TWork) => {
    await workService.update(uid, data);
};

const deleteStockElement = async (uid: string) => {
    await workService.delete(uid);
};

export  {
    createNewWorkElement,
    getAllWorks,
    getWorkByUID,
    updateWorkElement,
    deleteStockElement
}
