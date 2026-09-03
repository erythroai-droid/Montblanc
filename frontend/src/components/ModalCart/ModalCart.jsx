"use client";

import React from 'react';
import Close from '../../icons/Close/Close.jsx';
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { removeFromCart, closeCartModal } from "../../redux/slices/cartSlice/cartSlice.js";
import { useIntl } from "react-intl";
import styles from "./ModalCart.module.scss";

const closeStyle = {
	width: "16px",
	height: "16px",
	fill: "#999999",
};

const ModalCart = ({ cartItems }) => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const router = useRouter();
	const total = cartItems.reduce((sum, item) => sum + item.price * (item.number || 1), 0);

	const handleGoToOrder = () => {
		dispatch(closeCartModal());
		router.push('/order');
	};

	return (
		<div className={styles.dropCart}>
			<div className={styles.dropCartInner}>
				<div className={styles.orderInfo}>
					<p className={styles.cartHeader}>{intl.formatMessage({ id: "yourOrder" })}</p>
					<p className={styles.cartAmount}>
						<span>{total.toFixed(2)}</span> ₪
					</p>
				</div>
			</div>
			<div className={styles.cartItemContainer} data-items>
				{cartItems.length === 0 ? (
					<p className={styles.emptyText}>{intl.formatMessage({ id: "cartEmpty" })}</p>
				) : (
					cartItems.map((product) => (
						<div className={styles.cartOrderProduct} key={product.id}>
							<div className={styles.cartImage}>
								<img
									src={product.image}
									width="45"
									height="45"
									alt={product.title}
								/>
							</div>
							<p>{product.title}</p>
							<p><span data-price="">{product.price.toFixed(2)}</span> ₪</p>
							<p>{product.number} pcs</p>
							<button
								className={styles.cartClose}
								onClick={() => dispatch(removeFromCart(product.id))}
							>
								<Close {...closeStyle} />
							</button>
						</div>
					))
				)}
			</div>
			<button
				className={`${styles.dropCartButton} ${cartItems.length === 0 ? styles.hide : ''}`}
				data-cart-total
				onClick={handleGoToOrder}
			>
				{intl.formatMessage({ id: "order" })}
			</button>
		</div>
	);
};

export default ModalCart;