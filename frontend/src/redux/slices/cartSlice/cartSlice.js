import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
	if (typeof window !== "undefined") {
		try {
			const saved = localStorage.getItem("cart");
			return saved ? JSON.parse(saved) : [];
		} catch (e) {
			console.error("Failed to parse cart from localStorage", e);
			return [];
		}
	}
	return [];
};

const cartSlice = createSlice({
	name: "cart",
	initialState: {
		items: getInitialCart(),
		isCartOpen: false,
	},
	reducers: {
		initCart: (state) => {
			if (typeof window !== "undefined") {
				try {
					const saved = localStorage.getItem("cart");
					if (saved) {
						state.items = JSON.parse(saved);
					}
				} catch (e) {
					console.error("Failed to init cart", e);
				}
			}
		},
		addProductToCart: (state, action) => {
			const { counter, product } = action.payload;
			const newList = state.items.filter((p) => p.id !== product.id);
			state.items = [...newList, { ...product, number: counter }];
			if (typeof window !== "undefined") {
				try {
					localStorage.setItem("cart", JSON.stringify(state.items));
				} catch (e) {
					console.error("Failed to save cart to localStorage", e);
				}
			}
		},
		removeFromCart: (state, action) => {
			const productId = action.payload;
			state.items = state.items.filter((p) => p.id !== productId);
			if (typeof window !== "undefined") {
				try {
					localStorage.setItem("cart", JSON.stringify(state.items));
				} catch (e) {
					console.error("Failed to update cart in localStorage", e);
				}
			}
		},
		resetCart: (state) => {
			if (typeof window !== "undefined") {
				try {
					localStorage.removeItem("cart");
				} catch (e) {
					console.error("Failed to clear cart in localStorage", e);
				}
			}
			state.items = [];
			state.isCartOpen = false;
		},
		openCartModal: (state) => {
			state.isCartOpen = true;
		},
		toggleCartModal: (state) => {
			state.isCartOpen = !state.isCartOpen;
		},
		closeCartModal: (state) => {
			state.isCartOpen = false;
		},
	},
});

export const {
	initCart,
	addProductToCart,
	removeFromCart,
	resetCart,
	openCartModal,
	toggleCartModal,
	closeCartModal,
} = cartSlice.actions;

export default cartSlice.reducer;