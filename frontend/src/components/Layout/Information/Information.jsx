"use client";

import React from 'react';
import DeliveryIcon from "../../../icons/DeliveryIcon/DeliveryIcon.jsx";
import Support from "../../../icons/Support/Support.jsx";
import Payment from "../../../icons/Payment/Payment.jsx";
import {useIntl} from "react-intl";
const fillStyle = {
	width: "70px",
	height: "70px",
	fill:"#46BB22"
}
const Information = () => {
	const intl = useIntl();
	return (
		<section className="section_03">
			<h2>{intl.formatMessage({ id: "deliveryAndPayment" })}</h2>
			<div className="section_03__info">
				<div className="delivery">
					<DeliveryIcon {...fillStyle} />
					<h3>{intl.formatMessage({ id: "delivery" })}</h3>
					<p className="sub_text">{intl.formatMessage({ id: "dailyFrom" })}</p>
					<p>{intl.formatMessage({ id: "deliveryText" })}</p>
				</div>
				<div className="support">
		<Support {...fillStyle}/>
					<h3>{intl.formatMessage({ id: "support" })}</h3>
					<p className="sub_text">{intl.formatMessage({ id: "allDays" })}</p>
					<p>{intl.formatMessage({ id: "supportText" })}</p>
				</div>
				<div className="payment">
					<Payment {...fillStyle}/>
					<h3>{intl.formatMessage({ id: "payment" })}</h3>
					<p className="sub_text">{intl.formatMessage({ id: "convenient" })}</p>
					<p>{intl.formatMessage({ id: "paymentText" })}</p>
				</div>
			</div>
		</section>
	);
};

export default Information;
