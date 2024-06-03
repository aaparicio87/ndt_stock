import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { FB_DB } from "../config/firebase.conf";
import { STOCK } from "../utils/constants";


const createNewStockElement = async(data: TStock) => {
    try {
        const stockCollectionRef = collection(FB_DB, STOCK);
        await addDoc(stockCollectionRef, {
            ...data
          });
    } catch (error) {
        console.error(error)
    }
}

const getAllStcokElements = async () => {
    try {
        const listStock:TStock[] = []
        const querySnapshot = await getDocs(collection(FB_DB, STOCK));
        querySnapshot.forEach((doc) => {
           const uid = doc.id
           const stock = doc.data() as TStock
           listStock.push({uid, ...stock})
          });
        return listStock
    } catch (error) {
        console.error(error)   
    }
}

const getStockByUID = async(uid:string) => {
    try {
        const docRef = doc(FB_DB, STOCK, uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as TStock
        } else {
        throw new Error('Document not exist')
        }  
    } catch (error) {
        console.error(error)
    }
}

export {
    getAllStcokElements,
    createNewStockElement,
    getStockByUID,
}