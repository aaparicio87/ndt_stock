import { 
    browserSessionPersistence,
    signInWithEmailAndPassword, 
    UserCredential 
} from "firebase/auth"
import { getFunctions, httpsCallable } from "firebase/functions";
import { FB_AUTH, FB_DB } from "../config/firebase.conf"
import { STAFF } from "../utils/constants"
import FirebaseService from "./firebase.services";


interface ICreateUserResponse {
    success: boolean;
    uid?: string;
    error?: string;
}

const usersService = new FirebaseService<TStaff>(FB_DB, STAFF);

const registerUser = async (userData:TStaff): Promise<ICreateUserResponse> => {
    try {
        const functions = getFunctions();
        const createUserStaff = httpsCallable(functions, 'creatNewUSerStaff');

        const result = await createUserStaff(userData);

        const data = result.data as ICreateUserResponse;
        
        if (data.success) {
            return { success: true, uid: data.uid };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

const signIn = async (userData:TSignIn):Promise<UserCredential | undefined> => {
    try {
        const {email, password} = userData
        await FB_AUTH.setPersistence(browserSessionPersistence);
        return await signInWithEmailAndPassword(FB_AUTH, email, password)
    } catch (error) {
        console.error(error)
    }
}

const getStaffInformationByUserUID = async(userUID:string) => {
    return await usersService.getByUID(userUID);
}

const getAllStaff = async():Promise<TStaff[]| undefined> =>{
    return await usersService.getAll();
}

const logoutUser = async () => FB_AUTH.signOut()

const deleteStaffElement = async (uid: string) => {
    await usersService.delete(uid);
};

const updateStaffElement = async (uid: string, data: TStaff) => {
    await usersService.update(uid, data);
};

export{
    registerUser,
    logoutUser,
    signIn,
    getStaffInformationByUserUID,
    getAllStaff,
    deleteStaffElement,
    updateStaffElement,
}