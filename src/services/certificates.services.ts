import {  FB_DB } from "../config/firebase.conf"
import { CERTIFICATE } from "../utils/constants";
import FirebaseService from "./firebase.services";


const certificateService = new FirebaseService<TCertificates>(FB_DB, CERTIFICATE);

const getAllCertificates = async():Promise<TCertificates[]| undefined> =>{
    return await certificateService.getAll();
}

const deleteCertificateElement = async (uid: string) => {
    await certificateService.delete(uid);
};

const updateCertificateElement = async (uid: string, data: TCertificates) => {
    await certificateService.update(uid, data);
};

export{
    getAllCertificates,
    deleteCertificateElement,
    updateCertificateElement,
}