"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import useGetCategories from "../CatalogContainer/hooks/useGetCategories.jsx";
import { useLanguage } from "../../context/LanguageContext/LanguageContext.jsx";

const TopSidebar = () => {
	const params = useParams();
	const category = params?.category;
	const { categoriesList } = useGetCategories();
	const { locale } = useLanguage();
	const router = useRouter();
	const defaultCategoryId = 1;

	// Функция для получения имени категории по локали (для UI)
	const getNameByLocale = (item, locale) => {
		if (locale === 'ru' && item.name_ru) return item.name_ru;
		if (locale === 'he' && item.name_he) return item.name_he;
		return item.name; // Запасной вариант для 'en' или если перевод отсутствует
	};

	// Функция для генерации slug из английского имени
	const generateSlug = (name) => name ? name.toLowerCase().replace(/\s+/g, '-') : '';

	// Обработчик изменения выбора в select
	const handleCategoryChange = (event) => {
		const selectedCategoryId = event.target.value;
		const selectedCategory = categoriesList.find(
			(item) => item.id === parseInt(selectedCategoryId)
		);
		if (selectedCategory) {
			const categorySlug = generateSlug(selectedCategory.name);
			router.push(`/catalog/${categorySlug}`);
		}
	};

	return (
		<select
			id="category-select"
			className={`select__list lang-${locale}`}
			onChange={handleCategoryChange}
			value={
				categoriesList.find(
					(item) => generateSlug(item.name) === category
				)?.id || defaultCategoryId
			}
		>
			{categoriesList.map((item) => {
				const categoryName = getNameByLocale(item, locale);
				const categorySlug = generateSlug(item.name);

				return (
					<option
						key={item.id}
						value={item.id}
						className={categorySlug === category ? 'selected' : ''}
					>
						{categoryName}
					</option>
				);
			})}
		</select>
	);
};

export default TopSidebar;