"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from "./BreadCrumbs.module.scss";

const BreadCrumbs = () => {
	const pathname = usePathname() || '';
	const pathnames = pathname.split('/').filter((x) => x);

	// Функция преобразования названий
	const formatLabel = (label) =>
		label
			.split('-') // Разделяем по дефисам
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Каждое слово с заглавной буквы
			.join(' '); // Объединяем слова через пробел

	// Фильтрация сегментов пути, исключая "catalog" и productId (числовой сегмент)
	const filteredPathnames = pathnames.filter((segment, index) => {
		// Пропускаем сегмент "catalog"
		if (segment === 'catalog') {
			return false;
		}
		// Пропускаем числовой productId (обычно третий сегмент в /catalog/:category/:productId/:productName)
		if (pathnames[0] === 'catalog' && index === 2 && /^\d+$/.test(segment)) {
			return false;
		}
		return true;
	});

	if (pathname === '/') {
		return null;
	}

	return (
		<nav className={styles.breadcrumbs}>
			<ul className={styles.list}>
				{/* Всегда отображаем "Home" с разделителем */}
				<li className={styles.item}>
					<Link className={styles.link} href="/">
						Home
					</Link>
					{filteredPathnames.length > 0 && <span className={styles.separator}> → </span>}
				</li>

				{filteredPathnames.map((value, index) => {
					// Формируем путь, используя оригинальные pathnames до текущего индекса
					const originalIndex = pathnames.indexOf(value);
					const to = `/${pathnames.slice(0, originalIndex + 1).join('/')}`;
					const isLast = index === filteredPathnames.length - 1;
					const formattedLabel = formatLabel(value);

					return (
						<li key={to} className={styles.item}>
							{isLast ? (
								<span className={styles.current}>{formattedLabel}</span>
							) : (
								<>
									<Link className={styles.link} href={to}>
										{formattedLabel}
									</Link>
									<span className={styles.separator}> → </span>
								</>
							)}
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export default BreadCrumbs;