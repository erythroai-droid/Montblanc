import { createSelector } from "@reduxjs/toolkit";

export const selectProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectSpecials = (state) => state.products.specialItems;
export const selectSpecialsStatus = (state) => state.products.specialStatus;

export const selectIsLoadingByCategory = (state, catId) =>
  state.products.byCategory[catId]?.status === "loading";
export const selectErrorByCategory = (state, catId) =>
  state.products.byCategory[catId]?.error;

const selectCategoryState = (state, catId) => state.products.byCategory[catId];
export const selectProductsByCategory = createSelector(
  [selectCategoryState],
  (category) => category?.products || []
);
export const selectStatusByCategory = createSelector(
	[selectCategoryState],
	(category) => category?.status || null
);
