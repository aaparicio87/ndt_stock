import {
    browserSessionPersistence,
    EmailAuthProvider,
    getAuth,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    updatePassword,
    UserCredential
} from "firebase/auth"
import { getFunctions, httpsCallable } from "firebase/functions";
import { FB_AUTH, FB_DB } from "../config/firebase.conf"
import { STAFF } from "../utils/constants"
import FirebaseService from "./firebase.services";
import { FirebaseError } from "firebase/app";


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

        const result = await createUserStaff(userData)

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
        if (error instanceof FirebaseError) {
            // Mapea los códigos de error a mensajes más amigables
            switch (error.code) {
                case 'auth/invalid-credential':
                    throw new Error('Invalid credentials. Please check your email and password.');
                case 'auth/user-not-found':
                    throw new Error('User not found. Please check your email.');
                case 'auth/wrong-password':
                    throw new Error('Incorrect password. Please try again.');
                default:
                    throw new Error('An unexpected error occurred. Please try again.');
            }
        } else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
}

const changePassword = async (newPassword:string, currentPassword:string , email:string) => {

    const credential = EmailAuthProvider.credential(email, currentPassword);
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        return { success: false}
      }
    try {
        const response = await reauthenticateWithCredential(user, credential);
        if(response){
            await updatePassword(user, newPassword);
        }

        return { success: true}

    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

const getStaffInformationByUserUID = async(userUID:string) => {
    try {
        return await usersService.getByUID(userUID);
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

const getAllStaff = async():Promise<TStaff[]| undefined> =>{
    try {
        return await usersService.getAll();
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

const logoutUser = async () => FB_AUTH.signOut()

const deleteStaffElement = async (uid: string) => {
    try {
        await usersService.delete(uid);
    } catch (error) {
        throw new Error((error as Error).message)
    }
};

const updateStaffElement = async (uid: string, data: TStaff) => {
    try {
        await usersService.update(uid, data);
    } catch (error) {
        throw new Error((error as Error).message)
    }
};

export{
    registerUser,
    logoutUser,
    signIn,
    getStaffInformationByUserUID,
    getAllStaff,
    deleteStaffElement,
    updateStaffElement,
    changePassword
}
