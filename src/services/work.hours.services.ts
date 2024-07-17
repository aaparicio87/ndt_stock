import {addDoc, collection, doc, getDocs, updateDoc} from "firebase/firestore";
import {FB_DB} from "../config/firebase.conf.ts";
import {STAFF} from "../utils/constants.ts";

async function addWorkHours(staffId:string, workHoursData:TWorkHour) {
    const workHoursCollectionRef = collection(FB_DB, `${STAFF}/${staffId}/workHours`);
    try {
         await addDoc(workHoursCollectionRef, workHoursData);
    } catch (e) {
        throw new Error((e as Error).message)
    }
}

async function editWorkHours(staffId:string, workHourId:string, updatedWorkHoursData:TWorkHour) {
    const workHourDocRef = doc(FB_DB, `${STAFF}/${staffId}/workHours/${workHourId}`);
    try {
        await updateDoc(workHourDocRef, updatedWorkHoursData);
    } catch (e) {
        throw new Error((e as Error).message)
    }
}

async function getWorkHours(staffId:string) {
    try {     
        const workHoursCollectionRef = collection(FB_DB, `${STAFF}/${staffId}/workHours`);
        const workHoursSnapshot = await getDocs(workHoursCollectionRef);
        const workHoursList:TWorkHour[] = workHoursSnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data() as TWorkHour,
        }));
        return workHoursList
    } catch (error) {
        throw new Error((error as Error).message)
    }
}



export {
    addWorkHours,
    editWorkHours,
    getWorkHours
}
