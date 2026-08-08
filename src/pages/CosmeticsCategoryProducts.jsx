import { useParams } from "react-router-dom";
import CategoryProductsPage from "../components/CategoryProductsPage";

export default function CosmeticsCategoryProducts() {
  const { type } = useParams();

  const categoryMap = {
    men: {
      category: "Mens-Cosmetics",
      heading: "Men's Cosmetics",
    },

    women: {
      category: "Womens-Cosmetics",
      heading: "Women's Cosmetics",
    },

    kids: {
      category: "Kids-Cosmetics",
      heading: "Kids' Cosmetics",
    },
  };

  const selectedCategory =
    categoryMap[type] || categoryMap.women;

  return (
    <CategoryProductsPage
      category={selectedCategory.category}
      heading={selectedCategory.heading}
    />
  );
}