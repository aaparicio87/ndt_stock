import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_apiKey,
    authDomain: import.meta.env.VITE_authDomain,
    projectId: import.meta.env.VITE_projectId,
    storageBucket: import.meta.env.VITE_storageBucket,
    messagingSenderId: import.meta.env.VITE_messagingSenderId,
    appId: import.meta.env.VITE_appId,
    measurementId: import.meta.env.VITE_measurementId
  };
  
  // Initialize Firebase
  const FB_APP = initializeApp(firebaseConfig)
  const FB_AUTH = getAuth(FB_APP)
  const FB_DB = getFirestore(FB_APP)
  const FB_STORAGE = getStorage(FB_APP)
  
  export {
    FB_DB,
    FB_AUTH,
    FB_STORAGE
  }
