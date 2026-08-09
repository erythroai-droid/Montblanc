"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Product from "../Product/Product.jsx";
import LeftSidebar from "../LeftSidebar/LeftSidebar.jsx";
import { useIntl } from "react-intl";
import { useLanguage } from "../../context/LanguageContext/LanguageContext.jsx";
import TopSidebar from "../TopSidebar/TopSidebar.jsx";
import { selectCategories } from "../../redux/slices/categoriesSlice/categoriesSelectors.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCategory } from "../../redux/slices/productsSlice/productsSlice.js";
import {
  selectProductsByCategory,
  selectProductsError,
  selectProductsLoading,
  selectStatusByCategory,
} from "../../redux/slices/productsSlice/productsSelectors.js";
import ProductsListSkeleton from "../ProductList/ProductsListSkeleton.jsx";
import ProductsList from "../ProductList/ProductList.jsx";

const CategoryContainer = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { locale } = useLanguage();
  const params = useParams();
  const categoryParam = params?.category || "farm-gastronomy";

  const categoriesList = useSelector(selectCategories);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const { categoryId, selectedCategory } = useMemo(() => {
    const foundCategory = categoriesList.find(
      (item) => item.name.toLowerCase().replace(/\s+/g, "-") === categoryParam
    );

    return {
      categoryId: foundCategory?.id,
      selectedCategory: foundCategory,
    };
  }, [categoriesList, categoryParam]);

  const productsByCategories = useSelector((state) =>
    selectProductsByCategory(state, categoryId)
  );
  const statusByCategories = useSelector((state) =>
    selectStatusByCategory(state, categoryId)
  );

  useEffect(() => {
    if (categoryId && statusByCategories === null) {
      dispatch(fetchProductsByCategory(categoryId));
    }
  }, [dispatch, statusByCategories, categoryId]);

  return (
    <div className="section_catalog__container">
      <div className="top_sidebar">
        <h3>{intl.formatMessage({ id: "catalog" })}</h3>
        <TopSidebar />
      </div>
      <div className="left_sidebar">
        <h3>{intl.formatMessage({ id: "catalog" })}</h3>
        <LeftSidebar />
      </div>

      {loading ? (
        <ProductsListSkeleton />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : productsByCategories?.length === 0 ? (
        <p>{intl.formatMessage({ id: "categoryEmpty" })}</p>
      ) : (
        <ProductsList
          products={productsByCategories || []}
          selectedCategory={selectedCategory}
          locale={locale}
        />
      )}
    </div>
  );
};

export default CategoryContainer;
