import React from 'react';
import styles from './Product.module.scss';

const ProductSkeleton = () => (
	<li className={`${styles.item} ${styles.skeletonPulse}`}>
		{/* Image skeleton */}
		<div className={styles.itemImage}>
			<div
				style={{
					width: "137px",
					height: "156px",
					backgroundColor: "#e2e8f0",
					borderRadius: "6px",
				}}
			/>
		</div>

		{/* Price section skeleton */}
		<div className={styles.price}>
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
				<div style={{ width: "70px", height: "20px", backgroundColor: "#e2e8f0", borderRadius: "4px" }} />
				<div style={{ width: "90px", height: "14px", backgroundColor: "#e2e8f0", borderRadius: "4px" }} />
			</div>
		</div>

		{/* Product title skeleton */}
		<div className={styles.itemDescription}>
			<div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
				<div style={{ width: "140px", height: "14px", backgroundColor: "#e2e8f0", borderRadius: "4px" }} />
				<div style={{ width: "100px", height: "14px", backgroundColor: "#e2e8f0", borderRadius: "4px" }} />
			</div>
		</div>

		{/* Button skeleton */}
		<div
			style={{
				height: "36px",
				width: "140px",
				backgroundColor: "#e2e8f0",
				borderRadius: "40px",
			}}
		/>
	</li>
);

export default ProductSkeleton;
