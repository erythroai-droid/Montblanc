import React, { memo } from 'react';
import ProductSkeleton from "../Product/ProductSkeleton.jsx";
import styles from "./ProductList.module.scss";

const ProductsListSkeleton = memo(() => (
	<ul className={styles.list}>
		{Array.from({ length: 8 }).map((_, idx) => (
			<ProductSkeleton key={idx} />
		))}
	</ul>
));

ProductsListSkeleton.displayName = "ProductsListSkeleton";

export default ProductsListSkeleton;
