"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from "../../context/LanguageContext/LanguageContext.jsx";
import { selectCategories } from "../../redux/slices/categoriesSlice/categoriesSelectors.js";
import { useSelector } from "react-redux";
import styles from "./LeftSidebar.module.scss";

const LeftSidebar = () => {
	const params = useParams();
	const category = params?.category;
	const categoriesList = useSelector(selectCategories);
	const { locale } = useLanguage();
	const defaultCategoryId = 1;

	// Функция для получения имени категории по локали (для UI)
	const getNameByLocale = (item, locale) => {
		if (locale === 'ru' && item.name_ru) return item.name_ru;
		if (locale === 'he' && item.name_he) return item.name_he;
		return item.name; // Запасной вариант для 'en' или если перевод отсутствует
	};

	// Функция для генерации slug из английского имени
	const generateSlug = (name) => name ? name.toLowerCase().replace(/\s+/g, '-') : '';

	return (
		<ul className={styles.catalogList}>
			{categoriesList.map((item) => {
				const categoryName = getNameByLocale(item, locale);
				const categorySlug = generateSlug(item.name);

				const isSelected = category
					? categorySlug === category
					: item.id === defaultCategoryId;

				return (
					<li
						key={item.id}
						className={isSelected ? styles.selected : ''}
					>
						<Link href={`/catalog/${categorySlug}`} className={styles.catalogItem}>
							<span>{categoryName}</span>
						</Link>
					</li>
				);
			})}
		</ul>
	);
};

export default LeftSidebar;