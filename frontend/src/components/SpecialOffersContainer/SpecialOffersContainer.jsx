"use client";

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "../ProductList/ProductList.jsx";
import {
	selectSpecials,
	selectSpecialsStatus,
	selectProductsError,
} from "../../redux/slices/productsSlice/productsSelectors.js";
import { fetchProductsSpecials } from "../../redux/slices/productsSlice/productsSlice.js";
import { useIntl } from "react-intl";
import styles from "./SpecialOffersContainer.module.scss";

const SpecialOffersContainer = () => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const productSpecials = useSelector(selectSpecials);
	const specialStatus = useSelector(selectSpecialsStatus);
	const error = useSelector(selectProductsError);

	// Фильтрация продуктов с specialOffers === true
	const filteredProducts = useMemo(
		() => productSpecials.filter((product) => product.specialOffers) || [],
		[productSpecials]
	);

	useEffect(() => {
		if (specialStatus === "idle") {
			dispatch(fetchProductsSpecials());
		}
	}, [dispatch, specialStatus]);

	return (
		<section className={styles.section}>
			<h2>{intl.formatMessage({ id: "allOffers" })}</h2>
			{specialStatus === "loading" ? (
				<p className={styles.statusMessage}>{intl.formatMessage({ id: "loading" })}</p>
			) : error ? (
				<p className={styles.statusMessage}>{intl.formatMessage({ id: "error" })}: {error}. {intl.formatMessage({ id: "tryAgain" })}</p>
			) : !filteredProducts.length ? (
				<p className={styles.statusMessage}>{intl.formatMessage({ id: "noSpecialOffers" })}</p>
			) : (
				<ProductList products={filteredProducts} showDiscount={true} />
			)}
		</section>
	);
};

export default SpecialOffersContainer;