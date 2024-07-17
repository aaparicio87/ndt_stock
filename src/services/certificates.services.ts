import {  FB_DB } from "../config/firebase.conf"
import { CERTIFICATE } from "../utils/constants";
import FirebaseService from "./firebase.services";


const certificateService = new FirebaseService<TCertificates>(FB_DB, CERTIFICATE);

const getAllCertificates = async():Promise<TCertificates[]| undefined> =>{
    try {
        return await certificateService.getAll();
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

const deleteCertificateElement = async (uid: string) => {
    try {     
        await certificateService.delete(uid);
    } catch (error) {
        throw new Error((error as Error).message)
    }
};

const updateCertificateElement = async (uid: string, data: TCertificates) => {
    try {
        await certificateService.update(uid, data);
    } catch (error) {
        throw new Error((error as Error).message)
    }
};

export{
    getAllCertificates,
    deleteCertificateElement,
    updateCertificateElement,
}