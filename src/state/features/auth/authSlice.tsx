import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { AUTH_SLICE_NAME } from '../../../utils/constants'
import { createListCertificatesAction } from './thunk'


const INITIAL_STATE: UserResponse = {
    user: undefined,
    token: null,
    listCertificates: [],
    loading: false,
    status: 'idle',
    error: undefined
}

const slice = createSlice({
    name: AUTH_SLICE_NAME,
    initialState: INITIAL_STATE,
    reducers: {
        setCredentials: (state, action: PayloadAction<UserResponse>) => {
            const { token, user } = action.payload
            state.user = user
            state.token = token
        },
        updateUserData: (state, action: PayloadAction<TStaff>) => {
            state.user = action.payload
        },
        clearAuth: () => INITIAL_STATE
    },
    extraReducers: (builder) => {
        builder
            .addCase(createListCertificatesAction.pending, (state, _) => {
                state.status = 'loading'
                state.loading = true
            })
            .addCase(createListCertificatesAction.fulfilled, (state, action) => {
                state.listCertificates = action.payload.certificates
                state.status = 'succeeded'
                state.loading = false
            })
            .addCase(createListCertificatesAction.rejected, (state, _) => {
                state.error = "Error creating list of certificates"
                state.status = 'failed'
                state.loading = false
            })
    }
})

export const {
    setCredentials,
    clearAuth,
    updateUserData
} = slice.actions

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectCurrUserCert = (state: RootState) => state.auth.listCertificates