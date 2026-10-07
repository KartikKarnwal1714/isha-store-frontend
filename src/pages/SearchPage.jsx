import { useEffect, useState } from "react";
import { FaSearch, FaFire } from "react-icons/fa";

import { Link } from "react-router-dom";

import {
  getProducts,
  trackProductSearch,
} from "../api/productAPI";

import Navbar from "../components/Navbar";

export default function SearchProduct() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const mostSearched = [
    "T-Shirt",
    "Lower",
    "Perfume",
    "Makeup",
    "Jeans",
    "Cosmetics",
  ];


  const fetchProducts = async () => {
    const cleanSearch = search.trim();

    // Empty search par products load nahi honge
    if (!cleanSearch) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
  setLoading(true);

  const res = await getProducts({
    search: cleanSearch,
  });

  const foundProducts =
    res.data.products || [];

  setProducts(foundProducts);

  const customerToken =
    localStorage.getItem(
      "customerToken"
    );

  if (
    customerToken &&
    cleanSearch.length >= 2
  ) {
    trackProductSearch(cleanSearch).catch(
      (searchError) => {
        console.error(
          "Search tracking error:",
          searchError.response?.data ||
            searchError.message
        );
      }
    );
  }
} catch (error) {
  console.error(
    "Search Product Error:",
    error.response?.data ||
      error.message
  );

  setProducts([]);
} finally {
  setLoading(false);
}
  };
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [search]);

  const getProductImage = (product) => {
    return (
      product.colors?.[0]?.images?.[0] ||
      product.images?.[0]?.url ||
      product.images?.[0] ||
      "https://via.placeholder.com/500x500?text=No+Image"
    );
  };

  const getProductPrice = (product) => {
    return (
      product.colors?.[0]?.sizes?.[0]?.price ||
      product.price ||
      product.originalPrice ||
      0
    );
  };

  return (
    <div className="min-h-screen bg-[#fff7ed]">
      {/* TOP NAVBAR */}
      <Navbar variant="page" />

      {/* MAIN CONTENT */}
      <div className="pt-10 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-black">
            Search Products
          </h1>

          <p className="mt-3 text-gray-500">
            Search products, brands and categories
          </p>

          {/* SEARCH INPUT */}
          <div className="bg-white mt-10 p-4 rounded-[30px] shadow-xl flex items-center">
            <FaSearch className="text-gray-400 text-xl" />

            <input
              type="text"
              placeholder="Search anything..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full px-4 py-4 outline-none text-lg"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-500"
              >
                Clear
              </button>
            )}
          </div>

          {/* MOST SEARCHED */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaFire />
              Most Searched
            </h2>

            <div className="flex gap-4 flex-wrap mt-5">
              {mostSearched.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setSearch(item)}
                  className="bg-white px-5 py-3 rounded-full shadow hover:bg-[#7c3aed] hover:text-white transition"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* INITIAL MESSAGE */}
          {!search.trim() && (
            <div className="text-center mt-16">
              <FaSearch className="mx-auto text-5xl text-gray-300" />

              <h2 className="text-2xl font-bold mt-5">
                Search for your favourite products
              </h2>

              <p className="text-gray-500 mt-2">
                Search by product name, brand, category or
                subcategory
              </p>
            </div>
          )}

          {/* LOADING MESSAGE */}
          {loading && (
            <div className="text-center mt-16">
              <div className="w-10 h-10 mx-auto border-4 border-gray-200 border-t-[#7c3aed] rounded-full animate-spin" />

              <p className="text-xl font-bold mt-5">
                Searching products...
              </p>
            </div>
          )}

          {/* SEARCH RESULTS */}
          {!loading &&
            search.trim() &&
            products.length > 0 && (
              <>
                <div className="mt-12 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Search Results
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Results for “{search.trim()}”
                    </p>
                  </div>

                  <p className="text-gray-500">
                    {products.length}{" "}
                    {products.length === 1
                      ? "product"
                      : "products"}{" "}
                    found
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8 mt-6 pb-16">
                  {products.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl sm:rounded-[35px] border border-orange-100 overflow-hidden shadow-lg hover:-translate-y-2 transition duration-300"
                    >
                      <img
                        src={getProductImage(item)}
                        alt={item.name || "Product"}
                        className="h-[130px] sm:h-[260px] w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src =
                            "https://via.placeholder.com/500x500?text=No+Image";
                        }}
                      />

                      <div className="p-2.5 sm:p-5">
                        <h2 className="font-bold text-xs sm:text-xl line-clamp-1">
                          {item.name}
                        </h2>

                        <p className="text-gray-500 text-[11px] sm:text-base mt-1">
                          {item.brand || "No Brand"}
                        </p>

                        <p className="text-[10px] sm:text-sm text-gray-400 mt-1 line-clamp-1">
                          {item.category || "Uncategorized"}

                          {item.subCategory
                            ? ` / ${item.subCategory}`
                            : ""}
                        </p>

                        <p className="font-bold text-sm sm:text-xl mt-1.5 sm:mt-3">
                          ₹{getProductPrice(item)}
                        </p>

                        <Link to={`/product/${item._id}`}>
                          <button
                            type="button"
                            className="mt-2.5 sm:mt-5 w-full bg-[#7c3aed] text-white text-xs sm:text-base py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-[#6d28d9] transition"
                          >
                            View Product
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          {/* NO RESULTS */}
          {!loading &&
            search.trim() &&
            products.length === 0 && (
              <div className="text-center mt-20 pb-16">
                <FaSearch className="mx-auto text-5xl text-gray-300" />

                <h2 className="text-3xl font-bold mt-5">
                  No Products Found
                </h2>

                <p className="text-gray-500 mt-3">
                  No products matched “{search.trim()}”.
                  Try another keyword.
                </p>

                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-6 bg-[#7c3aed] text-white px-7 py-3 rounded-xl hover:bg-[#6d28d9] transition"
                >
                  Clear Search
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}