"use client";

import Logo from "../../../assets/images/Logo.png";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
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
import { toggleCartModal, closeCartModal } from "../../../redux/slices/cartSlice/cartSlice.js";
import ModalOverlay from "../../ModalOverlay/ModalOverlay.jsx";
import { useIntl } from "react-intl";
import FlagRu from "../../../icons/FlagRu/FlagRu.jsx";
import FlagEn from "../../../icons/FlagEn/FlagEn.jsx";
import { useAuth } from "../../../context/AuthContext/AuthContext.jsx";
import { useTheme } from "../../../context/ThemeContext/ThemeContext.jsx";
import ThemeSwitch from "../../ThemeSwitch/ThemeSwitch.jsx";
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
	const { theme, setTheme } = useTheme();
	const [isOverlayOpen, setIsOverlayOpen] = useState(false);
	const cartRef = useRef(null);

	useEffect(() => {
		if (!isModalOpen) return;
		const handleClickOutside = (event) => {
			if (cartRef.current && !cartRef.current.contains(event.target)) {
				dispatch(closeCartModal());
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [isModalOpen, dispatch]);

	const handleOpenOverlay = () => {
		setIsOverlayOpen(!isOverlayOpen);
	};

	const handleCloseModal = () => {
		setIsOverlayOpen(false);
	};

	const handleCartClick = (e) => {
		e.stopPropagation();
		dispatch(toggleCartModal());
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
							<li className={styles.auth}>
								<span className={styles.userBlock}>
									<Link
										href={user.isAdmin ? "/admin" : "#"}
										className={styles.userLink}
									>
										{user.userName}
									</Link>
									<span className={styles.userSep}> | </span>
									<button
										type="button"
										className={styles.exitBtn}
										onClick={logout}
										title="Exit"
									>
										{intl.formatMessage({ id: "logout" })}
									</button>
								</span>
							</li>
						) : (
							<li className={styles.auth}>
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
						<li className={styles.themeItem}>
							<ThemeSwitch
								checked={theme === "dark"}
								onChange={(isDark) => setTheme(isDark ? "dark" : "light")}
								aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
							/>
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
				<div className={styles.cartContainer} ref={cartRef}>
					<div className={styles.cart}>
						<button
							className={styles.cartButton}
							data-cart-target="true"
							onClick={handleCartClick}
							aria-expanded={isModalOpen}
							aria-label={intl.formatMessage({ id: "cart" })}
						>
							<CartIcon {...cartStyle} />
							<p>{intl.formatMessage({ id: "cart" })}</p>
							<p
								className={cartItems.length > 0 ? styles.amountItems : styles.amountItemsNull}
								data-amount="true"
							>
								{cartItems.length}
							</p>
						</button>
					</div>
					{isModalOpen && (
						<div className={`${styles.dropCartContainer} ${styles.open}`}>
							<ModalCart
								cartItems={cartItems}
								deleteFromCart={deleteFromCart}
							/>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;