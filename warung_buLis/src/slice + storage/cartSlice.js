import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    setCartItems: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.menu_id === action.payload.menu_id
      );

      if (existingItem) {
        existingItem.penjualan_jumlah += action.payload.penjualan_jumlah;
      } else {
        state.items.push(action.payload);
      }
      console.log("Item ditambahkan ke cart");
    },
    updateCartItemQuantity: (state, action) => {
      const { menu_id, penjualan_jumlah } = action.payload;
      const item = state.items.find((item) => item.menu_id === menu_id);
      if (item) {
        item.penjualan_jumlah = penjualan_jumlah;
      }
    },
    removeCartItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.menu_id !== action.payload
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  setCartItems,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
