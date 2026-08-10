"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
	removeFromCart,
	resetCart
} from "../../redux/slices/cartSlice/cartSlice.js";
import Close from "../../icons/Close/Close.jsx";
import { selectCartItems } from "../../redux/slices/cartSlice/cartSelectors.js";
import api from "../../api/api.js";
import { useIntl } from "react-intl";
import { useRouter } from "next/navigation";
import styles from "./OrderContainer.module.scss";

const closeStyle = {
	width: "18px",
	height: "18px",
	fill: "#94a3b8",
};

const OrderContainer = () => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const router = useRouter();
	const cartItems = useSelector(selectCartItems);
	const [deliveryTerms, setDeliveryTerms] = useState("Tomorrow from 9am to 12pm");
	const [paymentMethods, setPaymentMethods] = useState("By card to the courier");
	const [formData, setFormData] = useState({
		userName: "",
		userEmail: "",
		userAdress: "",
		userPhone: "",
		userComment: ""
	});
	const [isSending, setIsSending] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [formErrors, setFormErrors] = useState({});
	const total = cartItems.reduce((sum, item) => sum + item.price * (item.number || 1), 0);

	const validateForm = () => {
		const errors = {};
		if (!formData.userName.trim()) errors.userName = intl.formatMessage({ id: "inputName" });
		if (!formData.userEmail.trim()) errors.userEmail = intl.formatMessage({ id: "inputEmail" });
		else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) errors.userEmail = intl.formatMessage({ id: "invalidEmail" });
		if (!formData.userAdress.trim()) errors.userAdress = intl.formatMessage({ id: "inputAddress" });
		if (!formData.userPhone.trim()) errors.userPhone = intl.formatMessage({ id: "inputPhone" });
		else if (formData.userPhone.length < 9) errors.userPhone = intl.formatMessage({ id: "shortPhone" });
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleOrderSubmit = async () => {
		if (!validateForm()) return;

		setIsSending(true);
		setSuccessMessage("");
		setErrorMessage("");

		const orderData = {
			name: formData.userName,
			email: formData.userEmail,
			address: formData.userAdress,
			phone: formData.userPhone,
			comment: formData.userComment,
			delivery: deliveryTerms,
			payment: paymentMethods,
			total: total.toFixed(2),
			products: cartItems.map(item => ({
				image: item.image,
				name: item.title,
				price: item.price,
				value: item.number || 1
			}))
		};

		try {
			const response = await api.cart.postOrder(orderData);
			console.log('Server response:', response);

			setSuccessMessage("Order sent successfully!");
			dispatch(resetCart());

			setTimeout(() => {
				router.push('/');
			}, 3000);
		} catch (e) {
			console.error('Order error:', e);
			setErrorMessage("Error sending order. Please try again.");
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div className={styles.section}>
			<div className={styles.headerContainer}>
				<h2>{intl.formatMessage({ id: "orderProducts" })}</h2>
			</div>

			<div className={styles.shoppingCartContainer}>
				<div className={styles.cartItemContainer} data-items>
					{cartItems.length === 0 ? (
						<p className={styles.emptyCart}>Your cart is empty</p>
					) : (
						cartItems.map((product) => (
							<div key={product.id} className={styles.cartOrderProduct}>
								<div className={styles.cartImage}>
									<img
										src={product.image}
										width="50"
										height="50"
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
				<div className={styles.totalOrderPrice}>
					<h3>{intl.formatMessage({ id: "totalPrice" })}:</h3>
					<p><span data-order-price>{total.toFixed(2)}</span> ₪</p>
				</div>
				<div className={styles.orderDelivery}>
					<h4>{intl.formatMessage({ id: "orderTime" })}</h4>
					<div className={styles.radioGroup}>
						<label className={styles.radioLabel}>
							<input
								type="radio"
								checked={deliveryTerms === "Tomorrow from 9am to 12pm"}
								name="radio_1"
								value="Tomorrow from 9am to 12pm"
								onChange={(e) => setDeliveryTerms(e.target.value)}
							/>
							<span className={styles.checkmark}>{intl.formatMessage({ id: "tomorrowFrom" })} 9am to 12pm</span>
						</label>
						<label className={styles.radioLabel}>
							<input
								type="radio"
								checked={deliveryTerms === "Tomorrow from 1pm to 4pm"}
								name="radio_1"
								value="Tomorrow from 1pm to 4pm"
								onChange={(e) => setDeliveryTerms(e.target.value)}
							/>
							<span className={styles.checkmark}>{intl.formatMessage({ id: "tomorrowFrom" })} 1pm to 4pm</span>
						</label>
						<label className={styles.radioLabel}>
							<input
								type="radio"
								checked={deliveryTerms === "Tomorrow from 5pm to 8pm"}
								name="radio_1"
								value="Tomorrow from 5pm to 8pm"
								onChange={(e) => setDeliveryTerms(e.target.value)}
							/>
							<span className={styles.checkmark}>{intl.formatMessage({ id: "tomorrowFrom" })} 5pm to 8pm</span>
						</label>
					</div>
				</div>
				<div className={styles.orderInfo}>
					<form id="order_form" autoComplete="on">
						<h4>{intl.formatMessage({ id: "personalInformation" })}</h4>
						<label htmlFor="name">
							{intl.formatMessage({ id: "name" })}
							<span className={styles.red}>*</span>
						</label>
						<input
							placeholder={intl.formatMessage({ id: "yourName" })}
							autoComplete="on"
							name="name"
							id="name"
							type="text"
							required
							value={formData.userName}
							onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
						/>
						{formErrors.userName && <p className={styles.error}>{formErrors.userName}</p>}

						<label htmlFor="email">
							Email<span className={styles.red}>*</span>
						</label>
						<input
							placeholder="email"
							autoComplete="on"
							name="email"
							id="email"
							type="email"
							value={formData.userEmail}
							onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
							required
						/>
						{formErrors.userEmail && <p className={styles.error}>{formErrors.userEmail}</p>}

						<label htmlFor="adress">
							{intl.formatMessage({ id: "adress" })}
							<span className={styles.red}>*</span>
						</label>
						<input
							placeholder={intl.formatMessage({ id: "adressDelivery" })}
							name="adress"
							id="adress"
							type="text"
							value={formData.userAdress}
							onChange={(e) => setFormData({ ...formData, userAdress: e.target.value })}
							required
						/>
						{formErrors.userAdress && <p className={styles.error}>{formErrors.userAdress}</p>}

						<label htmlFor="phone">
							{intl.formatMessage({ id: "phone" })}
							<span className={styles.red}>*</span>
						</label>
						<input
							placeholder={intl.formatMessage({ id: "yourPhone" })}
							autoComplete="on"
							name="phone"
							id="phone"
							type="tel"
							value={formData.userPhone}
							onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
							required
						/>
						{formErrors.userPhone && <p className={styles.error}>{formErrors.userPhone}</p>}

						<label htmlFor="comment">{intl.formatMessage({ id: "comment" })}</label>
						<textarea
							name="comment"
							id="comment"
							placeholder={intl.formatMessage({ id: "leaveComment" })}
							value={formData.userComment}
							onChange={(e) => setFormData({ ...formData, userComment: e.target.value })}
						></textarea>
					</form>
				</div>
				<div className={styles.orderPayment}>
					<h4>{intl.formatMessage({ id: "payment" })}</h4>
					<div className={styles.container}>
						<label className={styles.wrapper}>
							<input
								type="radio"
								checked={paymentMethods === "By card to the courier"}
								name="radio_2"
								value="By card to the courier"
								onChange={(e) => setPaymentMethods(e.target.value)}
							/>
							{intl.formatMessage({ id: "cardToCourier" })}
						</label>
						<label className={styles.wrapper}>
							<input
								type="radio"
								checked={paymentMethods === "Cash to the courier"}
								onChange={(e) => setPaymentMethods(e.target.value)}
								name="radio_2"
								value="Cash to the courier"
							/>
							{intl.formatMessage({ id: "cashToCourier" })}
						</label>
						<label className={styles.wrapper}>
							<input
								type="radio"
								checked={paymentMethods === "VISA, MasterCard"}
								onChange={(e) => setPaymentMethods(e.target.value)}
								name="radio_2"
								value="VISA, MasterCard"
							/>
							VISA, MasterCard
						</label>
					</div>
				</div>
				<button
					className={styles.totalOrderPrice}
					data-order-send
					onClick={handleOrderSubmit}
					disabled={isSending || cartItems.length === 0}
				>
					<h3>
						{isSending
							? intl.formatMessage({ id: "sending", defaultMessage: "Sending..." })
							: intl.formatMessage({ id: "order", defaultMessage: "Order" })}
					</h3>
				</button>

				{successMessage && <p className={styles.status}>{successMessage}</p>}
				{errorMessage && <p className={styles.status} style={{ color: "#ef4444" }}>{errorMessage}</p>}
			</div>
		</div>
	);
};

export default OrderContainer;
