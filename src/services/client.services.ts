import {  FB_DB } from "../config/firebase.conf"
import { CLIENT } from "../utils/constants";
import FirebaseService from "./firebase.services";


const customerService = new FirebaseService<TCustomer>(FB_DB, CLIENT);

const getAllCustomers = async():Promise<TCustomer[]| undefined> =>{
    try {
        return await customerService.getAll();
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

const deleteCustomerElement = async (uid: string) => {
    try {     
        await customerService.delete(uid);
    } catch (error) {
        throw new Error((error as Error).message)
    }
};

const updateCustomerElement = async (uid: string, data: TCustomer) => {
    try {
        await customerService.update(uid, data);
    } catch (error) {
        throw new Error((error as Error).message)
    }
};

export{
    getAllCustomers,
    deleteCustomerElement,
    updateCustomerElement,
}