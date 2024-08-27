import { createAsyncThunk } from "@reduxjs/toolkit"
import { getUserCertificatesName, handleThunkError } from "../../../utils/functions"
import { RootState } from "../../store"
import { getAllCertificates } from "../../../services"


export const createListCertificatesAction = createAsyncThunk<{certificates: string[]}, void ,{ rejectValue: { message: string } }>(
    'auth/createListCertificatesAction',
    async (_, { rejectWithValue, getState }) => {
      const appState = getState() as RootState
      const {
        user
      } = appState.auth 
  
      const userCertifications = user?.certificates
      let result:string[] = []
     
      try {
        if(userCertifications){
            const certificates = await getAllCertificates()
            if(certificates){
                result = getUserCertificatesName(userCertifications, certificates)
            }
        }

        return {
            result
        }
      } catch (error) {
        return handleThunkError(error, rejectWithValue);
      }
  })