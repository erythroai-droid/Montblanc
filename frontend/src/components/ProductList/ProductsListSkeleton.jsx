import React, {memo} from 'react';
import ProductSkeleton from "../Product/ProductSkeleton.jsx";

const ProductsListSkeleton = memo(() => (
	<ul className="section_01__promotions">
		{Array.from({ length: 8 }).map((_, idx) => (
			<ProductSkeleton key={idx} />
		))}
	</ul>
));

export default ProductsListSkeleton;
