// src/components/Preloader/Preloader.jsx
import React, { useEffect, useState } from 'react';
import Logo from '../../assets/images/Logo.png'; // Убедитесь, что путь к логотипу правильный

const Preloader = () => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		// Устанавливаем таймер для скрытия прелоадера через 2 секунды
		const timer = setTimeout(() => {
			setIsVisible(false);
		}, 3000);

		// Очищаем таймер при размонтировании компонента
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className={`loaderArea ${isVisible ? '' : 'hide'}`}>
			<div className="preloader-bg"></div>
			<img
				src={Logo}
				height="84"
				width="250"
				className="pre_logo"
				alt="Preloader Logo"
			/>
		</div>
	);
};

export default Preloader;