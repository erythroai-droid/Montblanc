"use client";

import React from 'react';
import { useIntl } from "react-intl";

const DeliveryContainer = () => {
	const intl = useIntl();
	return (
		<section className="section_01">
			<h2>{intl.formatMessage({ id: "delivery" })}</h2>
			<div className="section_01__shopping-cart-container">
				<div className="order_delivery">
					<p className="order_delivery__text">
						Lorem Ipsum is simply dummy text of the printing and typesetting
						industry. Lorem Ipsum has been the industry's standard dummy text ever
						since the 1500s, when an unknown printer took a galley of type and
						scrambled it to make a type specimen book. It has survived not only
						five centuries, but also the leap into electronic typesetting,
						remaining essentially unchanged. It was popularised in the 1960s with
						the release of Letraset sheets containing Lorem Ipsum passages, and
						more recently with desktop publishing software like Aldus PageMaker
						including versions of Lorem Ipsum.
					</p>
				</div>
			</div>

		</section>
	);
};

export default DeliveryContainer;
