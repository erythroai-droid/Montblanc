"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "../ProductList/ProductList.jsx";
import {
	selectSpecials,
	selectSpecialsStatus,
	selectProductsError,
} from "../../redux/slices/productsSlice/productsSelectors.js";
import {
	fetchProductsByCategory,
	fetchProductsSpecials
} from "../../redux/slices/productsSlice/productsSlice.js";
import { useIntl } from "react-intl";
import useGetCategories from "../CatalogContainer/hooks/useGetCategories.jsx";
import styles from "./HomeContainer.module.scss";

const HomeContainer = () => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const productSpecials = useSelector(selectSpecials);
	const specialStatus = useSelector(selectSpecialsStatus);
	const error = useSelector(selectProductsError);
	const { categoriesList } = useGetCategories();
	const filteredProducts = useMemo(
		() => productSpecials.filter((product) => product.specialOffers).slice(0, 5) || [],
		[productSpecials]
	);

	useEffect(() => {
		if (specialStatus === "idle") {
			dispatch(fetchProductsSpecials());
		}
	}, [dispatch, specialStatus]);

	useEffect(() => {
		if (categoriesList) {
			categoriesList.forEach(item => {
				dispatch(fetchProductsByCategory(item.id));
			});
		}
	}, [dispatch, categoriesList]);

	return (
		<section className={styles.section}>
			<h2>{intl.formatMessage({ id: "specialOffers" })}</h2>
			{specialStatus === "loading" ? (
				<p className={styles.statusMessage}>Loading...</p>
			) : error ? (
				<p className={styles.statusMessage}>Error: {error}. Try again.</p>
			) : !filteredProducts.length ? (
				<p className={styles.statusMessage}>No special offers</p>
			) : (
				<ProductList products={filteredProducts} showDiscount={true} />
			)}
		</section>
	);
};

export default HomeContainer;