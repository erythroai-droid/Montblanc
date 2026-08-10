"use client";

import Link from 'next/link';
import { useIntl } from "react-intl";
import { selectCategories } from "../../../redux/slices/categoriesSlice/categoriesSelectors.js";
import { useSelector } from "react-redux";
import styles from "./NavBar.module.scss";

const NavBar = () => {
	const intl = useIntl();
	const categoriesList = useSelector(selectCategories);
	
	const firstCategorySlug = categoriesList && categoriesList.length > 0
		? (categoriesList[0]?.name || "farm-gastronomy").toLowerCase().replace(/\s+/g, "-")
		: "farm-gastronomy";

	return (
		<nav className={styles.nav}>
			<ul className={styles.menu}>
				<Link href={`/catalog/${firstCategorySlug}`} className={styles.menuItem}>
					{intl.formatMessage({ id: "catalog" })}
				</Link>
				<Link href="/all-offers" className={styles.menuItem}>
					{intl.formatMessage({ id: "allOffers" })}
				</Link>
				<Link href="/delivery" className={styles.menuItem}>
					{intl.formatMessage({ id: "delivery" })}
				</Link>
				<Link href="/contacts" className={styles.menuItem}>
					{intl.formatMessage({ id: "contacts" })}
				</Link>
			</ul>
		</nav>
	);
};

export default NavBar;
