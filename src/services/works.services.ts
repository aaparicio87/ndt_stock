import { FB_DB } from "../config/firebase.conf";
import { WORKS } from "../utils/constants";
import FirebaseService from "./firebase.services";


const workService = new FirebaseService<TWork>(FB_DB, WORKS);


const createNewWorkElement = async(data: TWork) => {
    try {     
        await workService.create(data);
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

const getAllWorks = async () => {
    try {
        return await workService.getAll();
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

const getWorkByUID = async(uid:string) => {
    try {
        return await workService.getByUID(uid);
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

const updateWorkElement = async (uid: string, data: TWork) => {
    try {
        await workService.update(uid, data);
    } catch (error) {
        throw new Error((error as Error).message)
    }
};

const deleteWorkElement = async (uid: string) => {
    try {
        await workService.delete(uid);
    } catch (error) {
        throw new Error((error as Error).message)
    }
};

export  {
    createNewWorkElement,
    getAllWorks,
    getWorkByUID,
    updateWorkElement,
    deleteWorkElement
}
