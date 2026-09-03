"use client";

import React, { useEffect, useState } from 'react';
import styles from "./PreLoader.module.scss";

const Preloader = () => {
	const [isVisible, setIsVisible] = useState(true);
	const [shouldRender, setShouldRender] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			const removeTimer = setTimeout(() => {
				setShouldRender(false);
			}, 500);
			return () => clearTimeout(removeTimer);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	if (!shouldRender) return null;

	return (
		<div className={`${styles.loaderArea} ${isVisible ? '' : styles.hide}`}>
			<div className={styles.preloaderBg}></div>
			<img
				src="/images/Logo.svg"
				height="84"
				width="250"
				className={styles.preLogo}
				alt="Preloader Logo"
			/>
			<p className={styles.preloaderDemoText}>Demo website version 2.0</p>
		</div>
	);
};

export default Preloader;