import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
  };

  const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers:{
        storeUserDetails : (state,action)=>{
            state.currentUser = action.payload
        },
        clearUserDetails : (state)=>{
            state.currentUser = null
        }
    }
})

export const {storeUserDetails, clearUserDetails} = userSlice.actions
export default userSlice.reducer


