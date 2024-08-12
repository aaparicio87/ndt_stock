import { 
    addDoc, 
    collection, 
    deleteDoc, 
    doc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    Firestore, 
    WithFieldValue,
    DocumentData,
    query,
    orderBy,
    where
} from "firebase/firestore";

class FirebaseService<T> {
    private readonly db: Firestore;
    private readonly collectionName: string;

    constructor(db: Firestore, collectionName: string) {
        this.db = db;
        this.collectionName = collectionName;
    }

    async create(data: WithFieldValue<DocumentData>): Promise<void> {
        try {
            const collectionRef = collection(this.db, this.collectionName);
            await addDoc(collectionRef, data);
        } catch (error) {
            throw new Error(`Error creating document in ${this.collectionName}: ${(error as Error).message}`)
        }
    }

    async getAll(): Promise<T[]> {
        try {
            const list: T[] = [];
            const querySnapshot = await getDocs(collection(this.db, this.collectionName));
            querySnapshot.forEach((doc) => {
                const uid = doc.id;
                const data = doc.data() as T;
                list.push({ ...data, uid } as T);
            });
            return list;
        } catch (error) {
            throw new Error(`Error getting documents from ${this.collectionName}: ${(error as Error).message}`)
        }
    }

    async getAllOrder(orderByField?: string, orderDirection: 'asc' | 'desc' = 'asc'): Promise<T[]> {
        try {
            let list: T[] = [];
            let q;
            if (orderByField) {
                q = query(collection(this.db, this.collectionName), orderBy(orderByField, orderDirection));
            } else {
                q = collection(this.db, this.collectionName);
            }
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const uid = doc.id;
                const data = doc.data() as T;
                list.push({ ...data, uid } as T);
            });
            return list;
        } catch (error) {
            throw new Error(`Error getting documents from ${this.collectionName}: ${(error as Error).message}`)
        }
    }

    async getByUID(uid: string): Promise<T | null> {
        try {
            const docRef = doc(this.db, this.collectionName, uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { ...docSnap.data(), uid } as T;
            } else {
                throw new Error('Document does not exist');
            }
        } catch (error) {
            throw new Error(`Error getting document by UID from ${this.collectionName}: ${(error as Error).message}`)
        }
    }

    async update(uid: string, data: Partial<T>): Promise<void> {
        try {
            const docRef = doc(this.db, this.collectionName, uid);
            await updateDoc(docRef, data);
        } catch (error) {
            throw new Error(`Error updating document in ${this.collectionName}: ${(error as Error).message}`)
        }
    }

    async delete(uid: string): Promise<void> {
        try {
            const docRef = doc(this.db, this.collectionName, uid);
            await deleteDoc(docRef);
        } catch (error) {
            throw new Error(`Error deleting document from ${this.collectionName}: ${(error as Error).message}`)
        }
    }

    async getByDateRange(startDate: string, endDate: string): Promise<T[]> {
        try {
            const list: T[] = [];
            
            const q = query(
                collection(this.db, this.collectionName),
                where('startDate', '>=', startDate),
                where('endDate', '<=', endDate),
                orderBy('startDate', 'desc')
            );

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                const uid = doc.id;
                const data = doc.data() as T;
                list.push({ ...data, uid } as T);
            });

            return list;
        } catch (error) {
            throw new Error(`Error getting documents from ${this.collectionName}: ${(error as Error).message}`);
        }
    }
}

export default FirebaseService;
