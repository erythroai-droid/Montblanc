import React, { createContext, useContext, useState, useEffect } from 'react';
import productsData from '../../data/package_products.json';
import product from "../../components/Product/Product.jsx"; // Импортируем JSON

const CartContext = createContext();

const CartProvider = ({ children }) => {
	// Используем данные из JSON как начальное состояние

	const [cartItems, setCartItems] = useState([]);

	const addToCart = (counter, product) =>
		setCartItems((prevList) => {
			const newList = prevList.filter((p) => p.id !== product.id);
			return [...newList, { ...product, number: counter }];
		});

	const deleteFromCart = (productId) =>{
		setCartItems((prevList) =>
			prevList.filter((p) => p.id !== productId)
		);
	}


	return (
		<CartContext.Provider value={{addToCart, cartItems,  deleteFromCart }}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => useContext(CartContext);
export default CartProvider;