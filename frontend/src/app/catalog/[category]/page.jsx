import CategoryContainer from "../../../components/CategoryContainer/CategoryContainer.jsx";

const formatCategoryTitle = (slug) => {
  if (!slug) return "Catalog";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const categoryTitle = formatCategoryTitle(resolvedParams?.category);

  return {
    title: `${categoryTitle} | Mont Blanc`,
    description: `Browse ${categoryTitle} quality Italian products at Mont Blanc.`,
    openGraph: {
      title: `${categoryTitle} | Mont Blanc`,
      description: `Browse ${categoryTitle} quality Italian products at Mont Blanc.`,
    },
  };
}

export default function CategoryPage() {
  return <CategoryContainer />;
}
