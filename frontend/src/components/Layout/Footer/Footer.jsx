"use client";

import React from 'react';
import Logo from "../../../assets/images/Logo.png";
import Payment from "../../../assets/images/payment.png";
import { useIntl } from "react-intl";
import Link from "next/link";

const Footer = () => {
	const intl = useIntl();
	return (
		<footer className="footer">
			<div className="footer__container">
				<div>
					<img
						src={typeof Logo === 'string' ? Logo : (Logo?.src || Logo)}
						width="250"
						height="84"
						alt="Mont Blanc"
					/>
					<p className="tel">050 145-28-41</p>
					<p className="time">{intl.formatMessage({ id: "daily_from" })} 8.00 to 21.00</p>
				</div>
				<div>
					<h5>{intl.formatMessage({ id: "buyers" })}</h5>
					<ul>
						<li className="header__menu-item"><Link href="/">Brand</Link></li>
						<li className="header__menu-item"><Link href="/">Recipes</Link></li>
						<li className="header__menu-item"><Link href="/order">How to order</Link></li>
						<li className="header__menu-item"><Link href="/delivery">Return of goods</Link></li>
						<li className="header__menu-item"><Link href="/all-offers">Loyalty program</Link></li>
					</ul>
				</div>
				<div>
					<h5>{intl.formatMessage({ id: "information" })}</h5>
					<ul>
						<li className="header__menu-item"><Link href="/delivery">Delivery and payment</Link></li>
						<li className="header__menu-item"><Link href="/contacts">Contacts and details</Link></li>
						<li className="header__menu-item"><Link href="/contacts">Privacy policy</Link></li>
						<li className="header__menu-item"><Link href="/contacts">Consent to data processing</Link></li>
					</ul>
				</div>
				<div>
					<h5>{intl.formatMessage({ id: "acceptPayment" })}</h5>
					<img
						src={typeof Payment === 'string' ? Payment : (Payment?.src || Payment)}
						width="170"
						alt="Payment methods"
					/>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
