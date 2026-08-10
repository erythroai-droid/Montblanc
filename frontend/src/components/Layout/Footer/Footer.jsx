"use client";

import React from 'react';
import Logo from "../../../assets/images/Logo.png";
import Payment from "../../../assets/images/payment.png";
import { useIntl } from "react-intl";
import Link from "next/link";
import styles from "./Footer.module.scss";

const Footer = () => {
	const intl = useIntl();
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div>
					<img
						src={typeof Logo === 'string' ? Logo : (Logo?.src || Logo)}
						width="250"
						height="84"
						alt="Mont Blanc"
					/>
					<p className={styles.tel}>050 145-28-41</p>
					<p className={styles.time}>{intl.formatMessage({ id: "daily_from" })} 8.00 to 21.00</p>
				</div>
				<div>
					<h5>{intl.formatMessage({ id: "buyers" })}</h5>
					<ul>
						<li><Link href="/">Brand</Link></li>
						<li><Link href="/">Recipes</Link></li>
						<li><Link href="/order">How to order</Link></li>
						<li><Link href="/delivery">Return of goods</Link></li>
						<li><Link href="/all-offers">Loyalty program</Link></li>
					</ul>
				</div>
				<div>
					<h5>{intl.formatMessage({ id: "information" })}</h5>
					<ul>
						<li><Link href="/delivery">Delivery and payment</Link></li>
						<li><Link href="/contacts">Contacts and details</Link></li>
						<li><Link href="/contacts">Privacy policy</Link></li>
						<li><Link href="/contacts">Consent to data processing</Link></li>
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
