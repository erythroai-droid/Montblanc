"use client";

import React from 'react';
import DeliveryIcon from "../../../icons/DeliveryIcon/DeliveryIcon.jsx";
import SupportIcon from "../../../icons/Support/Support.jsx";
import PaymentIcon from "../../../icons/Payment/Payment.jsx";
import { useIntl } from "react-intl";
import styles from "./Information.module.scss";

const fillStyle = {
	width: "70px",
	height: "70px",
	fill: "#46BB22"
};

const Information = () => {
	const intl = useIntl();
	return (
		<section className={styles.section}>
			<h2>{intl.formatMessage({ id: "deliveryAndPayment" })}</h2>
			<div className={styles.info}>
				<div className={styles.card}>
					<DeliveryIcon {...fillStyle} />
					<h3>{intl.formatMessage({ id: "delivery" })}</h3>
					<p className={styles.subText}>{intl.formatMessage({ id: "dailyFrom" })}</p>
					<p>{intl.formatMessage({ id: "deliveryText" })}</p>
				</div>
				<div className={styles.card}>
					<SupportIcon {...fillStyle}/>
					<h3>{intl.formatMessage({ id: "support" })}</h3>
					<p className={styles.subText}>{intl.formatMessage({ id: "allDays" })}</p>
					<p>{intl.formatMessage({ id: "supportText" })}</p>
				</div>
				<div className={styles.card}>
					<PaymentIcon {...fillStyle}/>
					<h3>{intl.formatMessage({ id: "payment" })}</h3>
					<p className={styles.subText}>{intl.formatMessage({ id: "convenient" })}</p>
					<p>{intl.formatMessage({ id: "paymentText" })}</p>
				</div>
			</div>
		</section>
	);
};

export default Information;
