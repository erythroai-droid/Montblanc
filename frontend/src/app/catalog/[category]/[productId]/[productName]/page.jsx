import DetailProductContainer from "../../../../../components/DetailProductContainer/DetailProductContainer.jsx";

const formatTitle = (slug) => {
  if (!slug) return "Product";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const productName = formatTitle(resolvedParams?.productName);
  const categoryName = formatTitle(resolvedParams?.category);

  return {
    title: `${productName} - ${categoryName} | Mont Blanc`,
    description: `Buy authentic Italian ${productName} in ${categoryName} category at Mont Blanc store.`,
    openGraph: {
      title: `${productName} | Mont Blanc`,
      description: `Buy authentic Italian ${productName} at Mont Blanc store.`,
      type: "article",
    },
  };
}

export default function ProductDetailPage() {
  return <DetailProductContainer />;
}
