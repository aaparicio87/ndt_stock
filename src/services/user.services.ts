import { 
    browserSessionPersistence,
    signInWithEmailAndPassword, 
    UserCredential 
} from "firebase/auth"

import { getFunctions, httpsCallable } from "firebase/functions";
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { FB_AUTH, FB_DB } from "../config/firebase.conf"
import { STAFF } from "../utils/constants"


interface ICreateUserResponse {
    success: boolean;
    uid?: string;
    error?: string;
}

const registerUser = async (userData:TStaff): Promise<ICreateUserResponse> => {
    try {
        const functions = getFunctions();
        const createUserStaff = httpsCallable(functions, 'creatNewUSerStaff');

        const result = await createUserStaff(userData);

        const data = result.data as ICreateUserResponse;
        console.log(data)
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
    try {
        const docRef = doc(FB_DB, STAFF, userUID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let staff = docSnap.data() as TStaff
            staff = {... staff , uid: userUID}
            return staff
        } else {
        throw new Error('Document not exist')
        }
       
    } catch (error) {
        console.error(error)
    }
}

const getAllStaff = async():Promise<TStaff[]| undefined> =>{
    try {
        const listStaff:TStaff[] = []
        const querySnapshot = await getDocs(collection(FB_DB, STAFF));
        querySnapshot.forEach((doc) => {
           const staff = doc.data() as TStaff
           listStaff.push({uid: doc.id, ...staff})
          });
        return listStaff
    } catch (error) {
        console.error(error)
    }
}

const logoutUser = async () => FB_AUTH.signOut()

const deleteStaffElement = async (uid: string) => {
    try {
        const staffkDocRef = doc(FB_DB, STAFF, uid);
        await deleteDoc(staffkDocRef);
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};

const updateStaffElement = async (uid: string, data: TStaff) => {
    try {
        const staffDocRef = doc(FB_DB, STAFF, uid);
        await updateDoc(staffDocRef, {
            ...data
        });
    } catch (error) {
        console.error(error);
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
}