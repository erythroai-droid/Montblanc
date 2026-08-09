"use client";

import Link from 'next/link';
import { useIntl } from "react-intl";
import { selectCategories } from "../../../redux/slices/categoriesSlice/categoriesSelectors.js";
import { useSelector } from "react-redux";

const NavBar = () => {
	const intl = useIntl();
	const categoriesList = useSelector(selectCategories);
	
	const firstCategorySlug = categoriesList && categoriesList.length > 0
		? (categoriesList[0]?.name || "farm-gastronomy").toLowerCase().replace(/\s+/g, "-")
		: "farm-gastronomy";

	return (
		<nav className="nav">
			<ul className="nav__menu">
				<Link href={`/catalog/${firstCategorySlug}`} className="nav__menu-item">
					{intl.formatMessage({ id: "catalog" })}
				</Link>
				<Link href="/all-offers" className="nav__menu-item">
					{intl.formatMessage({ id: "allOffers" })}
				</Link>
				<Link href="/delivery" className="nav__menu-item">
					{intl.formatMessage({ id: "delivery" })}
				</Link>
				<Link href="/contacts" className="nav__menu-item">
					{intl.formatMessage({ id: "contacts" })}
				</Link>
			</ul>
		</nav>
	);
};

export default NavBar;
