import { collection, getDocs } from "firebase/firestore";
import {  FB_DB } from "../config/firebase.conf"
import { CERTIFICATE, LEVEL } from "../utils/constants";
import FirebaseService from "./firebase.services";


const certificateService = new FirebaseService<TCertificates>(FB_DB, CERTIFICATE);

const getAllCertificates = async():Promise<TCertificates[]| undefined> =>{
    try {
        const certificates = await certificateService.getAllOrder('name', 'asc');
        const result = certificates.map(async(certificate) => {
            const path = `${CERTIFICATE}/${certificate.uid}/${LEVEL}`
            const levels = await getLevelsByCertificate(path)
            return {
                ...certificate,
                levels,
            } as  TCertificates
        })

        return Promise.all(result)
        
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

const getCertificateById = async(uid: string) => {
    try {
        return await certificateService.getByUID(uid);
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

const addCertificate = async(data: TCertificates) => {
    try {
        await certificateService.create(data)
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

const updateCertificateElement = async (uid: string, data: TCertificates) => {
    try {
        await certificateService.update(uid, data);
    } catch (error) {
        throw new Error((error as Error).message)
    }
};

const getLevelsByCertificate = async (path:string) => {
    try {
        const levelsSnapshot  = await getDocs(collection(FB_DB, path))
        return levelsSnapshot.docs.map((levels) =>({uid: levels.id, ...levels.data()})) as ILevel[]
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

export{
    getAllCertificates,
    deleteCertificateElement,
    updateCertificateElement,
    getCertificateById,
    addCertificate
}