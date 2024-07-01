import {  FB_DB } from "../config/firebase.conf"
import { CLIENT } from "../utils/constants";
import FirebaseService from "./firebase.services";


const customerService = new FirebaseService<TCustomer>(FB_DB, CLIENT);

const getAllCustomers = async():Promise<TCustomer[]| undefined> =>{
    return await customerService.getAll();
}

const deleteCustomerElement = async (uid: string) => {
    await customerService.delete(uid);
};

const updateCustomerElement = async (uid: string, data: TCustomer) => {
    await customerService.update(uid, data);
};

export{
    getAllCustomers,
    deleteCustomerElement,
    updateCustomerElement,
}