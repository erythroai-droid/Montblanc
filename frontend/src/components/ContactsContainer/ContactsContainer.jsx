"use client";

import React from 'react';
import { useIntl } from "react-intl";
import styles from "./ContactsContainer.module.scss";

const ContactsContainer = () => {
	const intl = useIntl();

	return (
		<section className={styles.section}>
			<h2>{intl.formatMessage({ id: "contacts" })}</h2>
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
				<div className={styles.mapContainer}>
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108169.91309768706!2d34.72705474725958!3d32.08791223385036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4ca6193b7c1f%3A0xc1fb72a2c0963f90!2z0KLQtdC70Ywt0JDQstC40LIsINCY0LfRgNCw0LjQu9GM!5e0!3m2!1sru!2s!4v1709311080584!5m2!1sru!2s"
						width="100%"
						height="400"
						style={{ border: 0, borderRadius: '8px' }}
						allowFullScreen=""
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					></iframe>
				</div>
			</div>
		</section>
	);
};

export default ContactsContainer;
