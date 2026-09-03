"use client";

import React, { useEffect } from 'react';
import Header from './Header/Header.jsx';
import NavBar from './NavBar/NavBar.jsx';
import { usePathname } from 'next/navigation';
import Advertising from './Advertising/Advertising.jsx';
import Information from './Information/Information.jsx';
import Support from './Support/Support.jsx';
import Footer from './Footer/Footer.jsx';
import SliderVanilla from "./SliderVanilla/SliderVanila.jsx";
import BreadCrumbs from "../BreadCrumbs/BreadCrumbs.jsx";
import Preloader from "../PreLoader/PreLoader.jsx";
import { useDispatch } from "react-redux";
import { fetchCategories } from "../../redux/slices/categoriesSlice/categoriesSlice.js";
import { initCart } from "../../redux/slices/cartSlice/cartSlice.js";

const Layout = ({ children }) => {
	const pathname = usePathname() || '/';
	const isHomePage = pathname === '/';
	const isAdminPage = pathname.startsWith('/admin');
	const dispatch = useDispatch();

	useEffect(() => {
		if (!isAdminPage) {
			dispatch(fetchCategories());
			dispatch(initCart());
		}
	}, [dispatch, isAdminPage]);

	if (isAdminPage) {
		return <>{children}</>;
	}

	return (
		<div>
			<Preloader />
			<Header />
			<NavBar />
			{isHomePage && <SliderVanilla />}
			{!isHomePage && <BreadCrumbs />}
			<main>{children}</main>
			<Advertising />
			<Information />
			<Support />
			<Footer />
		</div>
	);
};

export default Layout;