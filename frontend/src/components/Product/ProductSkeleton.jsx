import React from 'react';

const ProductSkeleton = () => (
	<li
		className="section_01__promotions-item animate-pulse"
		style={{
			width: "270px",
			padding: "30px",
			background: "var(--color-white)",
			border: "1px solid rgba(0, 0, 0, 0.1)",
			display: "flex",
			justifyContent: "center",
			flexDirection: "column",
			alignItems: "center",
			rowGap: "20px",
			boxSizing: "border-box",
		}}
	>
		{/* Image skeleton */}
		<div className="item-image">
			<div
				className="bg-gray-200 rounded-md"
				style={{
					width: "137px",
					height: "156px",
				}}
			/>
		</div>

		{/* Price section skeleton */}
		<div className="price">
			<div className="flex flex-col items-center space-y-2">
				<div className="h-4 bg-gray-200 rounded" style={{ width: "70px" }} />
				<div className="h-3 bg-gray-200 rounded" style={{ width: "90px" }} />
			</div>
		</div>

		{/* Product title skeleton - FIXED: Use div instead of p to contain other elements */}
		<div className="item-description w-full text-center">
			<div className="space-y-1">
				<div
					className="h-4 bg-gray-200 rounded mx-auto"
					style={{ width: "140px" }}
				/>
				<div
					className="h-4 bg-gray-200 rounded mx-auto"
					style={{ width: "110px" }}
				/>
			</div>
		</div>

		{/* Button skeleton */}
		<div
			className="section_01__promotions-item-button button bg-gray-200 rounded"
			style={{
				height: "40px",
				width: "140px",
			}}
		/>
	</li>
);

export default ProductSkeleton;
