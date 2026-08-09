import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
	removeFromCart,
	resetCart
} from "../../redux/slices/cartSlice/cartSlice.js";
import Close from "../../icons/Close/Close.jsx";
import { selectCartItems } from "../../redux/slices/cartSlice/cartSelectors.js";
import api from "../../api/api.js";

const closeStyle = {
	width: "20px",
	height: "20px",
	fill: "#ffffff",
};

const OrderContainer = () => {
	const dispatch = useDispatch();
	const cartItems = useSelector(selectCartItems);
	const [deliveryTerms, setDeliveryTerms] = React.useState("Tomorrow from 9am to 12pm");
	const [paymentMethods, setPaymentMethods] = React.useState("By card to the courier");
	const [formData, setFormData] = React.useState({
		userName: "",
		userEmail: "",
		userAdress: "",
		userPhone: "",
		userComment: ""
	});
	const [isSending, setIsSending] = React.useState(false);
	const [successMessage, setSuccessMessage] = React.useState("");
	const [errorMessage, setErrorMessage] = React.useState("");
	const [formErrors, setFormErrors] = React.useState({});

	const total = cartItems.reduce((sum, item) => sum + item.price * (item.number || 1), 0);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const validateForm = () => {
		const errors = {};
		if (!formData.userName.trim()) errors.userName = "Please, input name";
		if (!formData.userEmail.trim()) errors.userEmail = "Please, input email";
		else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) errors.userEmail = "Invalid email format";
		if (!formData.userAdress.trim()) errors.userAdress = "Please, input address";
		if (!formData.userPhone.trim()) errors.userPhone = "Please, input phone";
		else if (formData.userPhone.length < 9) errors.userPhone = "Too short phone number";
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
			const response = await api.cart.postOrder(orderData);  // Используем новый метод postOrder
			console.log('Server response:', response);  // Вывод ответа с сервера в консоль при успехе

			setSuccessMessage("Order sent successfully!");
			dispatch(resetCart());
			localStorage.removeItem('products');  // Очистка localStorage, если используется

			setTimeout(() => {
				window.location.href = '/';  // Редирект на главную
			}, 3000);
		} catch (e) {
			console.error('Order error:', e);
			setErrorMessage("Error sending order. Please try again.");
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div className="section_01">
			<div className="section_01__header_container">
				<h2>Order products</h2>
			</div>

			<div className="section_01__shopping-cart-container">
				<div className="cart-item-container" data-items>
					{cartItems.length === 0 ? (
						<p>Your cart is empty</p>
					) : (
						cartItems.map((product) => (
							<div key={product.id} className="cart-item-container">
								<div className="cart-order-product">
									<div className="cart-image">
										<img src={product.image} width="137" height="156" alt={product.title} />
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

				<div className="order_delivery">
					<h4>delivery</h4>
					<div className="order_delivery__container">
						<label className="wrapper">Tomorrow from 9am to 12pm
							<input
								type="radio"
								name="radio_1"
								value="Tomorrow from 9am to 12pm"
								checked={deliveryTerms === "Tomorrow from 9am to 12pm"}
								onChange={(e) => setDeliveryTerms(e.target.value)}
							/>
							<span className="checkmark">&nbsp;</span>
						</label>
						<label className="wrapper">Tomorrow from 12pm to 3pm
							<input
								type="radio"
								name="radio_1"
								value="Tomorrow from 12pm to 3pm"
								checked={deliveryTerms === "Tomorrow from 12pm to 3pm"}
								onChange={(e) => setDeliveryTerms(e.target.value)}
							/>
							<span className="checkmark">&nbsp;</span>
						</label>
						<label className="wrapper">Tomorrow from 3pm to 6pm
							<input
								type="radio"
								name="radio_1"
								value="Tomorrow from 3pm to 6pm"
								checked={deliveryTerms === "Tomorrow from 3pm to 6pm"}
								onChange={(e) => setDeliveryTerms(e.target.value)}
							/>
							<span className="checkmark">&nbsp;</span>
						</label>
					</div>
				</div>

				<div className="order_payment">
					<h4>payment</h4>
					<div className="order_payment__container">
						<label className="wrapper">By card to the courier
							<input
								type="radio"
								name="radio_2"
								value="By card to the courier"
								checked={paymentMethods === "By card to the courier"}
								onChange={(e) => setPaymentMethods(e.target.value)}
							/>
							<span className="checkmark">&nbsp;</span>
						</label>
						<label className="wrapper">Cash to the courier
							<input
								type="radio"
								name="radio_2"
								value="Cash to the courier"
								checked={paymentMethods === "Cash to the courier"}
								onChange={(e) => setPaymentMethods(e.target.value)}
							/>
							<span className="checkmark">&nbsp;</span>
						</label>
						<label className="wrapper">VISA, MasterCard
							<input
								type="radio"
								name="radio_2"
								value="VISA, MasterCard"
								checked={paymentMethods === "VISA, MasterCard"}
								onChange={(e) => setPaymentMethods(e.target.value)}
							/>
							<span className="checkmark">&nbsp;</span>
						</label>
					</div>
				</div>

				<div className="order_form">
					<form>
						<label htmlFor="name">Name<span className="red">*</span></label>
						<input
							placeholder="your name"
							name="userName"
							id="name"
							type="text"
							value={formData.userName}
							onChange={handleInputChange}
							required
						/>
						{formErrors.userName && <p className="error">{formErrors.userName}</p>}

						<label htmlFor="email">Email<span className="red">*</span></label>
						<input
							placeholder="your email"
							name="userEmail"
							id="email"
							type="email"
							value={formData.userEmail}
							onChange={handleInputChange}
							required
						/>
						{formErrors.userEmail && <p className="error">{formErrors.userEmail}</p>}

						<label htmlFor="address">Address<span className="red">*</span></label>
						<input
							placeholder="your address"
							name="userAdress"
							id="address"
							type="text"
							value={formData.userAdress}
							onChange={handleInputChange}
							required
						/>
						{formErrors.userAdress && <p className="error">{formErrors.userAdress}</p>}

						<label htmlFor="phone">Phone<span className="red">*</span></label>
						<input
							placeholder="your phone"
							name="userPhone"
							id="phone"
							type="tel"
							value={formData.userPhone}
							onChange={handleInputChange}
							required
						/>
						{formErrors.userPhone && <p className="error">{formErrors.userPhone}</p>}

						<label htmlFor="comment">Comment</label>
						<textarea
							name="userComment"
							id="comment"
							placeholder="leave your comment"
							value={formData.userComment}
							onChange={handleInputChange}
						></textarea>
					</form>
				</div>

				<button
					className="total_order_price"
					data-order-send
					onClick={handleOrderSubmit}
					disabled={isSending || cartItems.length === 0}
				>
					<h3>{isSending ? 'Sending...' : 'Order'}</h3>
				</button>

				{successMessage && <p className="success">{successMessage}</p>}
				{errorMessage && <p className="error">{errorMessage}</p>}
			</div>
		</div>
	);
};

export default OrderContainer;