import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuTerpilih: [],
};

export const menuSlice = createSlice({
  name: "menu",
  initialState: initialState,
  reducers: {
    pushMenu: (state, action) => {
      state.menuTerpilih.push(action.payload);
      console.log("Berhasil ! menu ditambahkan");
    },
    popMenu: (state, action) => {
      state.menuTerpilih = state.menuTerpilih.filter(
        (d) => d.menu_id !== action.payload.menu_id
      );
      console.log("Berhasil ! menu didelete");
    },
  },
});

export const { pushMenu, popMenu } = menuSlice.actions; // dipakai di file tujuan misal app.jsx
export default menuSlice.reducer; // untuk dipakai di storage
