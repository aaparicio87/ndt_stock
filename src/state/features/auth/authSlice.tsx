import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { AUTH_SLICE_NAME } from '../../../utils/constants'


const INITIAL_STATE: UserResponse = {
    user: undefined,
    token: null,
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
        clearAuth: () => INITIAL_STATE
    },
})

export const { setCredentials, clearAuth } = slice.actions

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user
