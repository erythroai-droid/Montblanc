import React, {useEffect, useState} from 'react';
import allProducts from "../../data/package_products.json";
import Product from "../Product/Product.jsx";

import axios from "axios";

const AllProducts = () => {
	// const { products } = useCart();
	const [productsByCategories, setProductsByCategories] = useState([]);
	const [categoryId, setCategoryId] = useState(1);
	const fetchProducts = async (cat) => {
		try {
			const response = await axios.get(`https://example.com/${cat}`);
		} catch (e) {
			console.log('Error fetching products');
		}
	}
	useEffect(() => {
		fetchProducts(categoryId);
	}, [categoryId])
	return (

		<ul className="section_01__promotions">
			{products.map((item) => (
				<Product
					key={item.id}
					product={item}
				/>
			))}
		</ul>

	);
};

export default AllProducts;
