"use client";

import React from 'react';
import Spices from '../../../assets/images/banners/banner_spices.png';
import Cheeses from '../../../assets/images/banners/banner_cheese.png';
import { useIntl } from "react-intl";

const Advertising = () => {
	const intl = useIntl();
	return (
		<section className="section_02">
			<div className="section_02__banner container">
				<div className="section_02__banner container inner_left">
					<img
						src={typeof Spices === 'string' ? Spices : (Spices?.src || Spices)}
						width="955"
						height="200"
						alt="Traditional Spices"
					/>
					<div className="text padding_right_50">
						<p className="padding_right_50">{intl.formatMessage({ id: "traditionalSpices" })}</p>
						<p>{intl.formatMessage({ id: "discount" })}</p>
					</div>
				</div>
				<div className="section_02__banner container inner_right">
					<img
						src={typeof Cheeses === 'string' ? Cheeses : (Cheeses?.src || Cheeses)}
						width="965"
						height="200"
						alt="Italian Cheeses"
					/>
					<div className="text padding_left_50">
						<p>{intl.formatMessage({ id: "italianCheeses" })}</p>
						<p className="padding_left_50">{intl.formatMessage({ id: "competitivePrices" })}</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Advertising;
