"use client";

import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useIntl } from "react-intl";

// Utility functions outside component
const formatForUrl = (str) => str?.toLowerCase().replace(/\s+/g, "-") || "";
const formatPrice = (price) => parseFloat(price || 0).toFixed(2);

const Product = memo(({ product, showDiscount = false }) => {
  const router = useRouter();
  const intl = useIntl();

  // Memoize the click handler
  const handleClick = useCallback(() => {
    const formattedUrl = `/catalog/${formatForUrl(product.category)}/${
      product.id
    }/${formatForUrl(product.title)}`;
    router.push(formattedUrl);
  }, [router, product.category, product.id, product.title]);

  // Pre-compute values
  const hasDiscount = !!(showDiscount && product.discount);
  const originalPrice = formatPrice(product.price);
  const discountedPrice = hasDiscount
    ? formatPrice(product.price * (1 - product.discount / 100))
    : null;

  return (
    <li className="section_01__promotions-item">
      <div className="item-image">
        <img
          src={product.image}
          width="137"
          height="156"
          alt={product.title}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="price">
        {hasDiscount ? (
          <>
            <div>
              <p className="extra">{discountedPrice}</p> ₪
            </div>
            <p className="offer">
              {originalPrice}₪
              <span className="percent">-{product.discount}%</span>
            </p>
          </>
        ) : (
          <p>
            <span className="extra">{originalPrice}</span> ₪
          </p>
        )}
      </div>
      <p className="item-description">{product.title}</p>
      <button
        type="button"
        className="section_01__promotions-item-button button"
        aria-label={`View details for ${product.title}`}
        onClick={handleClick}
      >
        {intl.formatMessage({ id: "viewProduct" })}
      </button>
    </li>
  );
});

Product.displayName = "Product";

export default Product;
