"use client";

import React from 'react';
import Spices from '../../../assets/images/banners/banner_spices.png';
import Cheeses from '../../../assets/images/banners/banner_cheese.png';
import { useIntl } from "react-intl";
import styles from "./Advertising.module.scss";

const Advertising = () => {
	const intl = useIntl();
	return (
		<section className={styles.section}>
			<div className={styles.banner}>
				<div className={styles.innerLeft}>
					<img
						src={typeof Spices === 'string' ? Spices : (Spices?.src || Spices)}
						width="955"
						height="200"
						alt="Traditional Spices"
					/>
					<div className={`${styles.text} ${styles.paddingRight50}`}>
						<p className={styles.paddingRight50}>{intl.formatMessage({ id: "traditionalSpices" })}</p>
						<p>{intl.formatMessage({ id: "discount" })}</p>
					</div>
				</div>
				<div className={styles.innerRight}>
					<img
						src={typeof Cheeses === 'string' ? Cheeses : (Cheeses?.src || Cheeses)}
						width="965"
						height="200"
						alt="Italian Cheeses"
					/>
					<div className={`${styles.text} ${styles.paddingLeft50}`}>
						<p>{intl.formatMessage({ id: "italianCheeses" })}</p>
						<p className={styles.paddingLeft50}>{intl.formatMessage({ id: "competitivePrices" })}</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Advertising;
