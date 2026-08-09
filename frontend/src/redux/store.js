import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice/productsSlice";
import categoriesReducer from "./slices/categoriesSlice/categoriesSlice";
import cartReducer from "./slices/cartSlice/cartSlice";

export const store = configureStore({
	reducer: {
		products: productsReducer,
		categories: categoriesReducer,
		cart: cartReducer,
	},
	devTools: true,
});
