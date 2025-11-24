import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userToken: null,
};

export const userSlice = new createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setLogin: (state, action) => {
        state.userToken = action.payload;
        //console.log('Berhasil ! user token telah terupdate');
    },
    setLogout: (state,action) => {
        state.userToken = null;
        //console.log('dari slice, token udah direset');
    }
  }
});

export const { setLogin,setLogout } = userSlice.actions; // dipakai di file tujuan misal app.jsx
export default userSlice.reducer; // untuk dipakai di storage
