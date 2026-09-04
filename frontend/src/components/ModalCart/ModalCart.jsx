"use client";

import React from 'react';
import Close from '../../icons/Close/Close.jsx';
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { removeFromCart, closeCartModal } from "../../redux/slices/cartSlice/cartSlice.js";
import { useIntl } from "react-intl";
import { useAuth } from "../../context/AuthContext/AuthContext.jsx";
import styles from "./ModalCart.module.scss";

const closeStyle = {
	width: "20px",
	height: "20px",
	fill: "#ffffff",
};

const ModalCart = ({ cartItems }) => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const router = useRouter();
	const { user } = useAuth();
	const isAuth = Boolean(user && user.isAuth);
	const total = cartItems.reduce((sum, item) => sum + item.price * (item.number || 1), 0);

	const handleAction = () => {
		dispatch(closeCartModal());
		if (isAuth) {
			router.push('/order');
		} else {
			router.push('/sign-in?redirect=/order');
		}
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
				onClick={handleAction}
			>
				{isAuth ? intl.formatMessage({ id: "order" }) : intl.formatMessage({ id: "sign_in" })}
			</button>
		</div>
	);
};

export default ModalCart;