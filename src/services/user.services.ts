import { 
    browserSessionPersistence,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    UserCredential 
} from "firebase/auth"
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { FB_AUTH, FB_DB } from "../config/firebase.conf"
import { STAFF } from "../utils/constants"


const registerUser = async (userData:TStaff):Promise<void> => {
    try {

        const {email, lastName, name, password, roles} = userData
        const response = await createUserWithEmailAndPassword(FB_AUTH, email, password)

        if(response){
            await setDoc(doc(FB_DB, STAFF, response.user.uid), {
                name,
                lastName,
                email,
                roles
            });
        }

    } catch (error) {
        console.error(error)
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
            return docSnap.data()
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
           listStaff.push(staff)
          });
        return listStaff
    } catch (error) {
        console.error(error)
    }
}

const logoutUser = async () => FB_AUTH.signOut()

export{
    registerUser,
    logoutUser,
    signIn,
    getStaffInformationByUserUID,
    getAllStaff
}