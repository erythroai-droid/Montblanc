"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Amount from "../Amount/Amount.jsx";
import useCalcAmount from "../../hooks/useCalcAmount.jsx";
import api from "../../api/api.js";
import useGetCategories from "../CatalogContainer/hooks/useGetCategories.jsx";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart, openCartModal } from "../../redux/slices/cartSlice/cartSlice.js";
import { useIntl } from "react-intl";
import {
	selectProductsByCategory
} from "../../redux/slices/productsSlice/productsSelectors.js";

const DetailProductContainer = () => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const params = useParams();
	const category = params?.category;
	const productId = params?.productId;

	const { handleDecrease, handleIncrease, counter } = useCalcAmount();
	const { categoriesList } = useGetCategories();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadProduct() {
			if (categoriesList.length > 0 && category && productId) {
				const selectedCategory = categoriesList.find(item =>
					item.name.toLowerCase().replace(/\s+/g, '-') === category
				);
				if (selectedCategory) {
					try {
						setLoading(true);
						const products = await api.products.getProductsList(selectedCategory.id);
						const foundProduct = products.find(p => p.id === parseInt(productId));
						if (foundProduct) {
							const normalized = {
								id: foundProduct.id,
								title: foundProduct.name,
								price: parseFloat(foundProduct.price),
								image: `data:image/png;base64,${foundProduct.image}`,
								category: foundProduct.categoryName,
								discount: foundProduct.discount,
								description: foundProduct.description || 'No description available'
							};
							setProduct(normalized);
						}
					} catch (e) {
						console.error('Ошибка при загрузке продукта:', e);
					} finally {
						setLoading(false);
					}
				}
			}
		}
		loadProduct();
	}, [category, productId, categoriesList]);

	if (loading && !product) {
		return (
			<section className="section_01">
				<p>Loading product...</p>
			</section>
		);
	}

	if (!product) {
		return (
			<section className="section_01">
				<h2>Product Not Found</h2>
				<p>The product you are looking for does not exist.</p>
			</section>
		);
	}

	const handleAddToCart = () => {
		dispatch(addProductToCart({ product, counter }));
		dispatch(openCartModal());
		if (typeof window !== 'undefined') {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}
	};

	// Функция для расчета цены со скидкой
	const calculatePrice = (price, discount) => {
		if (!discount || discount === 0) return parseFloat(price).toFixed(2);
		const discountedPrice = price * (1 - discount / 100);
		return parseFloat(discountedPrice).toFixed(2);
	};

	return (
		<section className="section_catalog">
			<div className="section_catalog__container_product">
				<div className="container_top">
					<div className="foto">
						<img
							src={product.image}
							alt={product.title}
						/>
					</div>
					<div className="description">
						<h4>{product.title}</h4>
						<p>{product.description}</p>
					</div>
				</div>
				<div className="container_bottom">
					<div className="amount">
						<h3>{intl.formatMessage({ id: "amount" })}</h3>
						<Amount handleDecrease={handleDecrease} handleIncrease={handleIncrease} counter={counter} />
					</div>
					<div className="price">
						<h3>{intl.formatMessage({ id: "price" })}</h3>
						<span className="extra">
							{calculatePrice(product.price, product.discount)} ₪
						</span>
					</div>
					<button
						className="section_01__promotions-item-button button"
						data-cart
						onClick={handleAddToCart}
					>
						{intl.formatMessage({ id: "addToCart" })}
					</button>
				</div>
			</div>
		</section>
	);
};

export default DetailProductContainer;