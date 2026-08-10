"use client";

import React, { useEffect, useState } from 'react';
import Logo from '../../assets/images/Logo.png';
import styles from "./PreLoader.module.scss";

const Preloader = () => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className={`${styles.loaderArea} ${isVisible ? '' : styles.hide}`}>
			<div className={styles.preloaderBg}></div>
			<img
				src={typeof Logo === 'string' ? Logo : (Logo?.src || Logo)}
				height="84"
				width="250"
				className={styles.preLogo}
				alt="Preloader Logo"
			/>
		</div>
	);
};

export default Preloader;