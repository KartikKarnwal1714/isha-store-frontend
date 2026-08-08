import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaFilter,
  FaTimes,
} from "react-icons/fa";

import { getProducts } from "../api/productAPI";
import Navbar from "./Navbar";

export default function CategoryProductsPage({
  category,
  heading,
}) {
  const { subCategory } = useParams();

  const decodedSubCategory = decodeURIComponent(
    subCategory || ""
  );

  // =========================================
  // PRODUCT STATES
  // =========================================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FILTER STATES
  // =========================================

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [sort, setSort] = useState("newest");
  const [inStock, setInStock] = useState(false);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  // =========================================
  // PAGINATION STATES
  // =========================================

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] =
    useState(0);

  const productsPerPage = 8;

  // =========================================
  // SEARCH DEBOUNCE
  // =========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
  category,
  subCategory: decodedSubCategory,
  search: debouncedSearch,
  sort,
  page: currentPage,
  limit: productsPerPage,
};

      if (inStock) {
        params.inStock = true;
      }

      if (minPrice !== "") {
        params.minPrice = minPrice;
      }

      if (maxPrice !== "") {
        params.maxPrice = maxPrice;
      }

      const response = await getProducts(params);

      setProducts(response.data.products || []);

      setTotalPages(
        response.data.pagination?.totalPages || 0
      );

      setTotalProducts(
        response.data.pagination?.totalProducts || 0
      );
    } catch (requestError) {
      console.error(
        "Men category products error:",
        requestError.response?.data ||
          requestError.message
      );

      setProducts([]);

      setError(
        requestError.response?.data?.message ||
          "Products could not be loaded"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchCategoryProducts();
}, [
  category,
  decodedSubCategory,
  debouncedSearch,
  sort,
  inStock,
  minPrice,
  maxPrice,
  currentPage,
]);

  // =========================================
  // PRODUCT HELPERS
  // =========================================

  const getProductImage = (product) => {
    return (
      product.colors?.[0]?.images?.[0] ||
      product.images?.[0]?.url ||
      product.images?.[0] ||
      product.image ||
      "https://via.placeholder.com/500x500?text=No+Image"
    );
  };

 const getProductPrice = (product) => {
  return Number(
    product.minimumPrice ||
      product.colors?.[0]?.sizes?.[0]?.price ||
      product.price ||
      0
  );
};

  const getProductOriginalPrice = (product) => {
  return Number(
    product.minimumOriginalPrice ||
      product.colors?.[0]?.sizes?.[0]
        ?.originalPrice ||
      product.originalPrice ||
      0
  );
};

 const getProductStock = (product) => {
  return Number(product.totalStock || 0);
};


  // =========================================
  // RESET FILTERS
  // =========================================

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSort("newest");
    setInStock(false);
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    sort !== "newest" ||
    inStock ||
    minPrice !== "" ||
    maxPrice !== "";

  // =========================================
  // PAGINATION
  // =========================================

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((previous) => previous - 1);

      window.scrollTo({
        top: 650,
        behavior: "smooth",
      });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((previous) => previous + 1);

      window.scrollTo({
        top: 650,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-[#f8f5ef] min-h-screen">
      {/* =====================================
          NAVBAR
      ====================================== */}

      <Navbar variant="page" />

      {/* =====================================
          HERO SECTION
      ====================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-10">
        <div className="relative rounded-2xl sm:rounded-[40px] overflow-hidden h-[160px] sm:h-[420px] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop"
            alt={decodedSubCategory}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
            <h1 className="text-white text-lg sm:text-4xl md:text-7xl font-black tracking-[1px] sm:tracking-[5px] md:tracking-[8px] text-center px-4">
              {heading.toUpperCase()}{" "}
              {decodedSubCategory.toUpperCase()}
            </h1>
          </div>
        </div>
      </div>

      {/* =====================================
          SEARCH BAR
      ====================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 sm:mt-10">
        <div className="bg-white rounded-2xl md:rounded-full flex items-center px-4 sm:px-6 py-2.5 sm:py-4 shadow border">
          <FaSearch className="text-gray-500" />

          <input
            id="searchInput"
            type="text"
            placeholder={`Search ${decodedSubCategory}...`}
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full bg-transparent px-4 outline-none"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-gray-400 hover:text-red-500"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* =====================================
          FILTER AND SORT SECTION
      ====================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-3 sm:mt-6">
        <div className="bg-white rounded-2xl sm:rounded-[28px] border shadow-sm p-3 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">
                {totalProducts}{" "}
                {totalProducts === 1
                  ? "Product"
                  : "Products"}{" "}
                Found
              </h2>

              <p className="text-sm text-gray-500">
                {heading} / {decodedSubCategory}
            </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* SORT SELECT */}

              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setCurrentPage(1);
                }}
                className="border rounded-xl px-4 py-3 outline-none bg-white"
              >
                <option value="newest">
                  Newest First
                </option>

                <option value="oldest">
                  Oldest First
                </option>

                <option value="nameAsc">
                  Name: A to Z
                </option>

                <option value="nameDesc">
                  Name: Z to A
                </option>

                <option value="priceLowToHigh">
                  Price: Low to High
                </option>

                <option value="priceHighToLow">
                  Price: High to Low
                </option>
              </select>

              {/* FILTER BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (previous) => !previous
                  )
                }
                className="flex items-center gap-2 border px-5 py-3 rounded-xl hover:bg-black hover:text-white transition"
              >
                <FaFilter />

                {showFilters
                  ? "Hide Filters"
                  : "Show Filters"}
              </button>

              {/* RESET BUTTON */}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* EXPANDED FILTERS */}

          {showFilters && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6 pt-6 border-t">
              {/* MINIMUM PRICE */}

              <div>
                <label className="block font-semibold mb-2">
                  Minimum Price
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="₹0"
                  value={minPrice}
                  onChange={(event) => {
                    setMinPrice(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border px-4 py-3 rounded-xl outline-none focus:border-black"
                />
              </div>

              {/* MAXIMUM PRICE */}

              <div>
                <label className="block font-semibold mb-2">
                  Maximum Price
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="₹5000"
                  value={maxPrice}
                  onChange={(event) => {
                    setMaxPrice(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border px-4 py-3 rounded-xl outline-none focus:border-black"
                />
              </div>

              {/* STOCK FILTER */}

              <div>
                <label className="block font-semibold mb-2">
                  Availability
                </label>

                <label className="border rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(event) => {
                      setInStock(event.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-5 h-5"
                  />

                  <span>In-stock products only</span>
                </label>
              </div>

              {/* ACTIVE CATEGORY */}

              <div>
                <label className="block font-semibold mb-2">
                  Category
                </label>

                <div className="border rounded-xl px-4 py-3 bg-gray-50">
                {heading} / {decodedSubCategory}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================
          PRODUCT SECTION
      ====================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-14">
        <h2 className="text-4xl font-black text-center mb-10">
            {heading} {decodedSubCategory}
        </h2>

        {/* ERROR */}

        {error && (
          <div className="max-w-xl mx-auto bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl text-center mb-8">
            <p className="font-bold">{error}</p>

            <button
              type="button"
              onClick={fetchCategoryProducts}
              className="mt-4 bg-red-600 text-white px-5 py-2 rounded-xl"
            >
              Try Again
            </button>
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto border-4 border-gray-200 border-t-black rounded-full animate-spin" />

            <p className="text-xl font-bold mt-5">
              Loading products...
            </p>
          </div>
        ) : products.length === 0 ? (
          /* NO PRODUCTS */

          <div className="text-center py-16">
            <FaSearch className="mx-auto text-5xl text-gray-300" />

            <h1 className="text-center text-3xl font-bold mt-5">
              No Products Found
            </h1>

            <p className="text-gray-500 mt-3">
              Change your search or filter settings.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 bg-black text-white px-7 py-3 rounded-xl"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* PRODUCT GRID */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
              {products.map((product) => {
                const price =
                  getProductPrice(product);

                const originalPrice =
                  getProductOriginalPrice(product);

                const stock =
                  getProductStock(product);

                const discount =
                  originalPrice > price &&
                  originalPrice > 0
                    ? Math.round(
                        ((originalPrice - price) /
                          originalPrice) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl sm:rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition group"
                  >
                    {/* PRODUCT IMAGE */}

                    <div className="relative overflow-hidden">
                      <Link
                        to={`/product/${product._id}`}
                      >
                        <img
                          src={getProductImage(product)}
                          alt={
                            product.name || "Product"
                          }
                          className="h-[140px] sm:h-[280px] w-full object-cover group-hover:scale-105 transition duration-500"
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://via.placeholder.com/500x500?text=No+Image";
                          }}
                        />
                      </Link>

                      {discount > 0 && (
                        <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-green-600 text-white text-[10px] sm:text-sm font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                          {discount}% OFF
                        </span>
                      )}

                      {stock <= 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white text-red-600 font-bold text-xs sm:text-base px-3 py-1.5 sm:px-5 sm:py-2 rounded-full">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* PRODUCT INFORMATION */}

                    <div className="p-2.5 sm:p-5 text-left">
                      <Link
                        to={`/product/${product._id}`}
                      >
                        <h3 className="text-xs sm:text-lg font-semibold text-black leading-snug line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-[11px] sm:text-sm text-gray-600 mt-1">
                        {product.brand}
                      </p>

                      <div className="flex items-end gap-2 mt-1.5 sm:mt-3">
                        <span className="text-sm sm:text-2xl font-black text-black">
                          ₹{price}
                        </span>

                        {originalPrice > price && (
                          <span className="text-[11px] sm:text-sm text-gray-500 line-through mb-0.5 sm:mb-1">
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>

                      {stock > 2 && (
                        <p className="text-green-600 font-semibold text-[11px] sm:text-base mt-1 sm:mt-2">
                          In Stock
                        </p>
                      )}

                      {stock > 0 && stock <= 2 && (
                        <p className="text-orange-600 font-bold text-[11px] sm:text-base mt-1 sm:mt-2">
                          Only {stock} left
                        </p>
                      )}

                      {stock <= 0 && (
                        <p className="text-red-600 font-bold text-[11px] sm:text-base mt-1 sm:mt-2">
                          Out of Stock
                        </p>
                      )}

                      <Link
                        to={`/product/${product._id}`}
                        className="block mt-2.5 sm:mt-5 w-full bg-black text-white text-center text-xs sm:text-base py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-gray-800 transition"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAGINATION */}

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-14">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 border px-6 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black hover:text-white transition"
                >
                  <FaArrowLeft />
                  Previous
                </button>

                <div className="bg-white border rounded-xl px-6 py-3 font-bold">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={
                    currentPage === totalPages
                  }
                  className="flex items-center gap-2 border px-6 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black hover:text-white transition"
                >
                  Next
                  <FaArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}