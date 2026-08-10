"use client";

import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import styles from "./Product.module.scss";

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
    <li className={styles.item}>
      <div className={styles.itemImage}>
        <img
          src={product.image}
          width="137"
          height="156"
          alt={product.title}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className={styles.price}>
        {hasDiscount ? (
          <>
            <div className={styles.priceRow}>
              <p className={styles.extra}>{discountedPrice}</p> ₪
            </div>
            <p className={styles.offer}>
              {originalPrice}₪
              <span className={styles.percent}>-{product.discount}%</span>
            </p>
          </>
        ) : (
          <div className={styles.priceRow}>
            <span className={styles.extra}>{originalPrice}</span> ₪
          </div>
        )}
      </div>
      <p className={styles.itemDescription}>{product.title}</p>
      <button
        type="button"
        className={styles.button}
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
