// export const selectCartItems = (state) => state.cart;
//
// Modified cartSelectors.js
export const selectCartItems = (state) => state.cart.items;
export const selectIsCartOpen = (state) => state.cart.isCartOpen;