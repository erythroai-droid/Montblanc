"use client";

import React from 'react';
import Close from '../../icons/Close/Close.jsx';
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { removeFromCart, closeCartModal } from "../../redux/slices/cartSlice/cartSlice.js";
import { useIntl } from "react-intl";

const closeStyle = {
	width: "20px",
	height: "20px",
	fill: "#ffffff",
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
		<div className="header__drop-cart">
			<div className="drop-cart-inner">
				<p className="cart_header">{intl.formatMessage({ id: "yourOrder" })}</p>
				<p className="cart-amount">
					<span className="cart-amount-total">{total.toFixed(2)}</span> ₪
				</p>
			</div>
			<div className="cart-item-container" data-items>
				{cartItems.length === 0 ? (
					<p>{intl.formatMessage({ id: "cartEmpty" })}</p>
				) : (
					cartItems.map((product) => (
						<div key={product.id} className="cart-item-container">
							<div className="cart-order-product" key={product.id}>
								<div className="cart-image">
									<img
										src={product.image}
										width="137"
										height="156"
										alt={product.title}
									/>
								</div>
								<p>{product.title}</p>
								<p><span data-price="">{product.price.toFixed(2)}</span> ₪</p>
								<p>{product.number} pcs</p>
								<button
									className="cart-close"
									onClick={() => dispatch(removeFromCart(product.id))}
								>
									<Close {...closeStyle} />
								</button>
							</div>
						</div>
					))
				)}
			</div>
			<button
				className={`header__drop-cart-button ${cartItems.length === 0 ? 'hide' : ''}`}
				data-cart-total
				onClick={handleGoToOrder}
			>
				{intl.formatMessage({ id: "order" })}
			</button>
		</div>
	);
};

export default ModalCart;