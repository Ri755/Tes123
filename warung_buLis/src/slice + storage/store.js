import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import menuSlice from "./menuSlice";
import cartSlice from "./cartSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    menu: menuSlice,
    cart: cartSlice,
  },
});

export default store;
