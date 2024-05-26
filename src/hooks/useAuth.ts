import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuth, selectCurrentUser, setCredentials } from '../state/features/auth/authSlice'
import { AppDispatch } from '../state/store';
import { getStaffInformationByUserUID, logoutUser, registerUser, signIn } from '../services';
import { useNavigate } from 'react-router-dom'
import { FB_AUTH } from '../config/firebase.conf';

export const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate()
  
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const unsuscribe = FB_AUTH.onAuthStateChanged(async(userFb) => {
      if (userFb !==null) {
        const token = await userFb.getIdToken()
        await handleGetProfileData(userFb.uid, token)
        navigate('/')
      } else {
        handleLogout()
      }
    })
    return unsuscribe
  }, [])

  const handleLogin = useCallback(async (credentials: TSignIn) => {
    try {
      const result = await signIn(credentials)
      if(result){
        const {user} = result
        const token = await user.getIdToken()
        await  handleGetProfileData(user.uid, token)
        navigate('/')
      }
      
    } catch (error) {
      console.error(error)
    }
  }, [dispatch]);

  const handleGetProfileData = async (userUID:string, token:string) => {
    try {
      const remoteData = await getStaffInformationByUserUID(userUID)
        if(remoteData){
          const userData = remoteData as TStaff

          dispatch(setCredentials({
            token,
            user:{
              ...userData
            }
          }))
        }
    } catch (error) {
      console.error(error)
    }
  }

  const handleRegister = useCallback(async (userInfo: TSignUp) => {
    try {
      const {email, lastName, name, password} = userInfo
      const registerData:TStaff = {
        email,
        lastName,
        name,
        password,
        roles:['USER']
      }
      await registerUser(registerData)
    } catch (error) {
      console.error(error)
    }
  }, []);

  const handleLogout = useCallback(async () => {
        try {
          await logoutUser()
          dispatch(clearAuth())
        } catch (error) {
          console.error()
        }
    },[dispatch])
  

  return useMemo(() => ({ 
    user,
    login: handleLogin,
    register: handleRegister, 
    logout: handleLogout,
    profile: handleGetProfileData
  }), [user, handleLogin, handleRegister, handleGetProfileData])
}
