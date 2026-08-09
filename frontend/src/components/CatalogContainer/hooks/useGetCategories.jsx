// import React, {useEffect, useState} from 'react';
// import api from "../../../api/api.js";
// import {useDispatch, useSelector} from "react-redux";
// import {
// 	fetchCategories
// } from "../../../redux/slices/categoriesSlice/categoriesSlice.js";
// import {
// 	selectCategories
// } from "../../../redux/slices/categoriesSlice/categoriesSelectors.js";
//
// const useGetCategories = () => {
// 	const categoriesList = useSelector(selectCategories);
// 	// const [categoriesList, setCategoriesList] = useState([]);
// 	const dispatch = useDispatch();
// 	// const fetchCategoriesList = async () => {
// 	// 	try {
// 	// 		const categories = await api.category.getCategories();
// 	// 		setCategoriesList(categories);
// 	// 	} catch (e) {
// 	// 		console.log('Ошибка при получении категорий:', e);
// 	// 	}
// 	// };
//
// 	useEffect(() => {
// 		// fetchCategoriesList();
// 		dispatch(fetchCategories());
// 	}, []);
//
// 	return {categoriesList};
// };
//
// export default useGetCategories;


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../redux/slices/categoriesSlice/categoriesSlice.js";
import { selectCategories } from "../../../redux/slices/categoriesSlice/categoriesSelectors.js";

const useGetCategories = () => {
	const categoriesList = useSelector(selectCategories);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchCategories());
	}, [dispatch]);

	return { categoriesList };
};

export default useGetCategories;