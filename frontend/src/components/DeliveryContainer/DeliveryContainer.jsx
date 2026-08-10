"use client";

import React from 'react';
import { useIntl } from "react-intl";
import styles from "./DeliveryContainer.module.scss";

const DeliveryContainer = () => {
	const intl = useIntl();
	return (
		<section className={styles.section}>
			<h2>{intl.formatMessage({ id: "delivery" })}</h2>
			<div className={styles.container}>
				<p className={styles.text}>
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
		</section>
	);
};

export default DeliveryContainer;
