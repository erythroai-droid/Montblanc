"use client";

import React, { memo } from "react";
import Product from "../Product/Product.jsx";

const ProductsList = memo(({ products = [], selectedCategory, locale, showDiscount = false }) => {
  const getNameByLocale = (item, loc) => {
    if (!item) return "";
    if (loc === "ru" && item?.name_ru) return item?.name_ru;
    if (loc === "he" && item?.name_he) return item?.name_he;
    return item?.name || "";
  };

  const categoryTitle = selectedCategory ? getNameByLocale(selectedCategory, locale) : null;

  return (
    <div className={selectedCategory ? "right_sidebar" : ""}>
      {categoryTitle && <h2>{categoryTitle}</h2>}
      <ul className="section_01__promotions">
        {products.map((item) => (
          <Product key={item.id} product={item} showDiscount={showDiscount} />
        ))}
      </ul>
    </div>
  );
});

ProductsList.displayName = "ProductsList";

export default ProductsList;