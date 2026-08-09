import {createSlice} from "@reduxjs/toolkit";


const userFormSlice = createSlice({
	name: "userForm",
	initialState:
		{
			deliveryFrom9to12: true,
			deliveryFrom1to4: false,
			deliveryFrom5to8: false,
			userName: "",
			userEmail: "",
			userAdress: "",
			userPhone: "",
			userComment: "",
			paymentToCourier: true,
			paymentByCash: false,
			paymentByCard: false
		},


	reducers: {
		addInfo: (state, action) => {
			const {counter, product} = action.payload;
			const newList = state.filter((p) => p.id !== product.id);
			return [...newList, {...product, number: counter}];
		},
		removeFromCart: (state, action) => {
			const productId = action.payload;
			return state.filter((p) => p.id !== productId);
		},


	},
});

export const {addInfo, removeFromCart} =
	userFormSlice.actions;
export default userFormSlice.reducer;
