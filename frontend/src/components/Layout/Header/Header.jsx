"use client";

import Logo from "../../../assets/images/Logo.png";
import Link from "next/link";
import React, { useState } from "react";
import PhoneIcon from "../../../icons/PhoneIcon/PhoneIcon.jsx";
import ClockIcon from "../../../icons/ClockIcon/ClockIcon.jsx";
import CartIcon from "../../../icons/CartIcon/CartIcon.jsx";
import { useLanguage } from "../../../context/LanguageContext/LanguageContext.jsx";
import { useCart } from "../../../context/CartContext/CartContext.jsx";
import ModalCart from "../../ModalCart/ModalCart.jsx";
import {
	selectCartItems,
	selectIsCartOpen
} from "../../../redux/slices/cartSlice/cartSelectors.js";
import { useSelector, useDispatch } from "react-redux";
import { toggleCartModal } from "../../../redux/slices/cartSlice/cartSlice.js";
import ModalOverlay from "../../ModalOverlay/ModalOverlay.jsx";
import { useIntl } from "react-intl";
import FlagRu from "../../../icons/FlagRu/FlagRu.jsx";
import FlagEn from "../../../icons/FlagEn/FlagEn.jsx";
import { useAuth } from "../../../context/AuthContext/AuthContext.jsx";
import styles from "./Header.module.scss";

const iconStyle = {
	width: "20px",
	height: "20px",
	fill: "#ffffff",
};

const cartStyle = {
	width: "20px",
	height: "18px",
	fill: "#ffffff",
};

const Header = () => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const { deleteFromCart } = useCart();
	const cartItems = useSelector(selectCartItems);
	const isModalOpen = useSelector(selectIsCartOpen);
	const { locale, setLocale } = useLanguage();
	const { user, logout } = useAuth();
	const [isOverlayOpen, setIsOverlayOpen] = useState(false);

	const handleOpenOverlay = () => {
		setIsOverlayOpen(!isOverlayOpen);
	};

	const handleCloseModal = () => {
		setIsOverlayOpen(false);
	};

	return (
		<header className={styles.header}>
			<div className={styles.inner}>
				<Link
					href="/"
					className={styles.logo}
				>
					<img
						className={styles.logoImage}
						src={typeof Logo === 'string' ? Logo : (Logo?.src || Logo)}
						alt="Mont Blanc"
						width="250"
						height="84"
					/>
				</Link>
				<div className={styles.menu}>
					<ul>
						{user && user.isAuth ? (
							<>
								{user.isAdmin && (
									<li>
										<Link href="/admin" className={styles.headerButton}>
											{intl.formatMessage({ id: "admin_panel" })}
										</Link>
									</li>
								)}
								<li>
									<span className={styles.userNameBadge}>
										{user.userName}
									</span>
								</li>
								<li>
									<button
										className={styles.headerButton}
										onClick={logout}
									>
										{intl.formatMessage({ id: "logout" })}
									</button>
								</li>
							</>
						) : (
							<li>
								<button
									className={styles.headerButton}
									onClick={handleOpenOverlay}
								>
									{intl.formatMessage({ id: "sign_in" })}
								</button>
								{isOverlayOpen && (
									<ModalOverlay
										isOverlayOpen={isOverlayOpen}
										onCloseOverlay={handleCloseModal}
									/>
								)}
							</li>
						)}

						<li
							className={`${styles.menuItem} ${locale === "en" ? styles.active : ""}`}
							onClick={() => setLocale("en")}
						>
							<FlagEn />
						</li>
						<li
							className={`${styles.menuItem} ${locale === "ru" ? styles.active : ""}`}
							onClick={() => setLocale("ru")}
						>
							<FlagRu />
						</li>
					</ul>
				</div>
				<div className={styles.contact}>
					<PhoneIcon {...iconStyle} />
					<div>
						<p className={styles.tel}>050 145-28-41</p>
						<p className={styles.time}>{intl.formatMessage({ id: "support" })} 0800 574 54 44</p>
					</div>
				</div>
				<div className={styles.contact}>
					<ClockIcon {...iconStyle} />
					<div>
						<p className={styles.tel}>{intl.formatMessage({ id: "store_open" })}</p>
						<p className={styles.time}>{intl.formatMessage({ id: "daily_from" })} 8.00 to 21.00</p>
					</div>
				</div>
				<div className={styles.cartContainer}>
					<div className={styles.cart}>
						<button
							className={styles.cartButton}
							onClick={() => dispatch(toggleCartModal())}
						>
							<CartIcon {...cartStyle} />
							<p>{intl.formatMessage({ id: "cart" })}</p>
							<p
								className={styles.amountBadge}
								data-amount
							>
								{cartItems.length}
							</p>
						</button>
						{isModalOpen && (
							<ModalCart
								cartItems={cartItems}
								deleteFromCart={deleteFromCart}
							/>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;