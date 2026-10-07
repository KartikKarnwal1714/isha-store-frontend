import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { API_URL } from "../utils/apiUrl";

export default function BrandProducts() {
  const { brandName } = useParams();

  const { addToCart } = useCart();

  const {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  const [popup, setPopup] = useState({
    show: false,
    text: "",
  });

  const rowRefs = useRef([]);

  const showPopupMessage = (message) => {
    setPopup({
      show: true,
      text: message,
    });

    setTimeout(() => {
      setPopup({
        show: false,
        text: "",
      });
    }, 2000);
  };

  const getProductImage = (product) => {
    return (
      product.colors?.[0]?.images?.[0] ||
      product.images?.[0]?.url ||
      product.images?.[0] ||
      product.image ||
      "https://via.placeholder.com/500"
    );
  };

  const getDefaultColor = (product) => {
    return product.colors?.[0] || null;
  };

  const getDefaultSize = (product) => {
    return product.colors?.[0]?.sizes?.[0] || null;
  };

  const getProductPrice = (product) => {
    return Number(
      product.colors?.[0]?.sizes?.[0]?.price ||
        product.price ||
        0
    );
  };

  const getProductOriginalPrice = (product) => {
    return Number(
      product.colors?.[0]?.sizes?.[0]?.originalPrice ||
        product.originalPrice ||
        0
    );
  };

  const handleAddToCart = (product) => {
    const defaultColor = getDefaultColor(product);
    const defaultSize = getDefaultSize(product);

    if (!defaultColor || !defaultSize) {
      showPopupMessage("Size or color not available ❌");
      return;
    }

    if (Number(defaultSize.stock) <= 0) {
      showPopupMessage("Product out of stock ❌");
      return;
    }

    addToCart({
      ...product,
      title: product.name,
      image: getProductImage(product),
      selectedSize: defaultSize.size || "Default",
      selectedColor:
        defaultColor.colorName || "Default",
      price:
        Number(defaultSize.price) > 0
          ? defaultSize.price
          : product.price,
      originalPrice:
        Number(defaultSize.originalPrice) > 0
          ? defaultSize.originalPrice
          : product.originalPrice,
      quantity: 1,
    });

    showPopupMessage("Added To Cart 🛒");
  };

  const toggleWishlist = (product) => {
    const exists = wishlistItems.find(
      (item) => item._id === product._id
    );

    const defaultSize = getDefaultSize(product);

    if (exists) {
      removeFromWishlist(product._id);
      showPopupMessage("Removed from Wishlist ❌");
    } else {
      addToWishlist({
        ...product,
        title: product.name,
        image: getProductImage(product),
        price:
          Number(defaultSize?.price) > 0
            ? defaultSize.price
            : product.price,
        originalPrice:
          Number(defaultSize?.originalPrice) > 0
            ? defaultSize.originalPrice
            : product.originalPrice,
      });

      showPopupMessage("Added to Wishlist ❤️");
    }
  };

  /*
    FETCH ALL PRODUCTS OF THE BRAND

    Maximum = 1000 products

    Backend is requested in pages of 50.

    Example:

    50
    50
    50
    50
    ...
    
    until:
    - no more products
    OR
    - 1000 products are reached
  */

  const fetchBrandProducts = async () => {
    try {
      setLoading(true);

      let allProducts = [];
      let page = 1;

      const maxProducts = 1000;
      const productsPerPage = 50;

      let hasNextPage = true;

      while (
        hasNextPage &&
        allProducts.length < maxProducts
      ) {
        const productRes = await fetch(
          `${API_URL}/products?brand=${encodeURIComponent(
            brandName
          )}&page=${page}&limit=${productsPerPage}`
        );

        if (!productRes.ok) {
          throw new Error(
            "Failed to fetch brand products"
          );
        }

        const productData = await productRes.json();

        const pageProducts =
          productData.products || [];

        if (pageProducts.length === 0) {
          break;
        }

        allProducts = [
          ...allProducts,
          ...pageProducts,
        ];

        if (
          productData.pagination &&
          typeof productData.pagination.hasNextPage !==
            "undefined"
        ) {
          hasNextPage =
            productData.pagination.hasNextPage;
        } else {
          hasNextPage =
            pageProducts.length === productsPerPage;
        }

        page++;
      }

      setProducts(
        allProducts.slice(0, maxProducts)
      );

      /*
        FETCH BRAND INFORMATION
      */

      const brandRes = await fetch(
        `${API_URL}/brands`
      );

      if (brandRes.ok) {
        const brandData = await brandRes.json();

        const selectedBrand =
          brandData.brands?.find(
            (item) =>
              item.name.toLowerCase() ===
              brandName.toLowerCase()
          );

        setBrand(selectedBrand || null);
      }
    } catch (error) {
      console.log(
        "Brand Products Error:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandProducts();

    rowRefs.current = [];
  }, [brandName]);

  /*
    DIVIDE PRODUCTS INTO GROUPS OF 15

    Example:

    45 products

    Row 1 = 1 - 15
    Row 2 = 16 - 30
    Row 3 = 31 - 45
  */

  const productRows = [];

  for (let i = 0; i < products.length; i += 15) {
    productRows.push(
      products.slice(i, i + 15)
    );
  }

  /*
    SLIDE ONE PARTICULAR ROW LEFT
  */

  const scrollRowLeft = (rowIndex) => {
    const row = rowRefs.current[rowIndex];

    if (row) {
      row.scrollBy({
        left: -row.clientWidth,
        behavior: "smooth",
      });
    }
  };

  /*
    SLIDE ONE PARTICULAR ROW RIGHT
  */

  const scrollRowRight = (rowIndex) => {
    const row = rowRefs.current[rowIndex];

    if (row) {
      row.scrollBy({
        left: row.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">

      {/* POPUP */}

      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-[5000] pointer-events-none">
          <div className="bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 px-10 py-6 rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.35)] border border-white/40 backdrop-blur-xl animate-bounce">
            <h2 className="text-2xl font-black text-black tracking-wide">
              {popup.text}
            </h2>
          </div>
        </div>
      )}

      {/* NAVBAR */}

      <Navbar variant="page" />

      {/* BRAND BANNER */}

      <section className="relative h-[420px] rounded-b-[50px] overflow-hidden bg-black">

        {brand?.bannerImage ||
        brand?.brandImage ? (
          <img
            src={
              brand.bannerImage ||
              brand.brandImage
            }
            alt={brand?.name}
            className="w-full h-full object-cover"
          />
        ) : null}

        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center px-10 md:px-20">

          <p className="text-white uppercase tracking-[4px]">
            Brand Collection
          </p>

          <h1
            className="text-5xl md:text-6xl font-black mt-4"
            style={{
              color:
                brand?.nameColor ||
                "#ffffff",
            }}
          >
            {brand?.name || brandName}
          </h1>

          <p className="text-gray-200 mt-5 max-w-xl">
            {brand?.tagline ||
              `Explore all products from ${brandName}`}
          </p>

        </div>
      </section>

      {/* PRODUCTS SECTION */}

      <section className="px-5 sm:px-8 py-12 sm:py-16">

        {/* HEADING */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">

          <div>

            <h2 className="text-3xl sm:text-4xl font-black">
              {brand?.name || brandName} Products
            </h2>

            <p className="text-gray-500 mt-2">
              Explore all products from this brand
            </p>

            {!loading && (
              <p className="text-gray-400 text-sm mt-1">
                {products.length} products available
              </p>
            )}

          </div>

          <Link
            to="/brands"
            className="bg-black text-white px-6 py-3 rounded-full text-center"
          >
            Back to Brands
          </Link>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="flex items-center justify-center py-20">

            <p className="text-xl font-semibold">
              Loading all products...
            </p>

          </div>

        ) : products.length === 0 ? (

          /* NO PRODUCTS */

          <div className="bg-white rounded-3xl p-10 text-center shadow">

            <h3 className="text-3xl font-bold">
              No products found
            </h3>

            <p className="text-gray-500 mt-3">
              Add products with brand name "
              {brandName}" from admin panel.
            </p>

          </div>

        ) : (

          /* MULTIPLE PRODUCT ROWS */

          <div className="space-y-10">

            {productRows.map(
              (rowProducts, rowIndex) => (

                <div
                  key={rowIndex}
                  className="relative"
                >

                  {/* LEFT ARROW */}

                  {rowProducts.length > 4 && (
                    <button
                      onClick={() =>
                        scrollRowLeft(
                          rowIndex
                        )
                      }
                      className="
                        absolute
                        left-1
                        sm:left-3
                        top-1/2
                        -translate-y-1/2
                        z-30
                        bg-white
                        w-12
                        h-12
                        sm:w-14
                        sm:h-14
                        rounded-full
                        shadow-xl
                        flex
                        items-center
                        justify-center
                        text-xl
                        hover:bg-black
                        hover:text-white
                        transition
                      "
                    >
                      <FaChevronLeft />
                    </button>
                  )}

                  {/* PRODUCT ROW */}

                  <div
                    ref={(element) => {
                      rowRefs.current[rowIndex] =
                        element;
                    }}
                    className="
                      flex
                      gap-4
                      sm:gap-5
                      overflow-x-auto
                      scroll-smooth
                      px-1
                      sm:px-2
                      pb-5
                    "
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >

                    {rowProducts.map(
                      (product) => {

                        const isWishlisted =
                          wishlistItems.find(
                            (item) =>
                              item._id ===
                              product._id
                          );

                        const price =
                          getProductPrice(
                            product
                          );

                        const originalPrice =
                          getProductOriginalPrice(
                            product
                          );

                        return (

                          <div
                            key={
                              product._id
                            }
                            className="
                              flex-none
                              bg-[#fffaf2]
                              rounded-[28px]
                              overflow-hidden
                              shadow-md
                              hover:shadow-2xl
                              transition
                              duration-500
                              group
                            "
                            style={{
                              width:
                                "calc((100% - 80px) / 4.25)",
                            }}
                          >

                            {/* IMAGE */}

                            <div className="relative overflow-hidden">

                              <Link
                                to={`/product/${product._id}`}
                              >

                                <img
                                  src={getProductImage(
                                    product
                                  )}
                                  alt={
                                    product.name
                                  }
                                  className="
                                    w-full
                                    h-[260px]
                                    object-cover
                                    group-hover:scale-105
                                    transition
                                    duration-500
                                  "
                                />

                              </Link>

                              {/* WISHLIST */}

                              <button
                                onClick={() =>
                                  toggleWishlist(
                                    product
                                  )
                                }
                                className={`
                                  absolute
                                  top-4
                                  right-4
                                  w-11
                                  h-11
                                  rounded-full
                                  flex
                                  items-center
                                  justify-center
                                  shadow-lg
                                  transition
                                  ${
                                    isWishlisted
                                      ? "bg-red-500 text-white"
                                      : "bg-white text-gray-800 hover:bg-black hover:text-white"
                                  }
                                `}
                              >
                                <FaHeart />
                              </button>

                            </div>

                            {/* DETAILS */}

                            <div className="p-5">

                              <Link
                                to={`/product/${product._id}`}
                              >

                                <h3 className="text-lg font-bold line-clamp-1 hover:underline">
                                  {
                                    product.name
                                  }
                                </h3>

                              </Link>

                              <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                                {product.brand ||
                                  brandName}
                              </p>

                              {/* PRICE */}

                              <div className="mt-3">

                                <p className="font-black text-xl text-[#7c3aed]">
                                  ₹{price}
                                </p>

                                {originalPrice >
                                  0 && (
                                  <p className="text-gray-400 line-through text-sm">
                                    ₹
                                    {
                                      originalPrice
                                    }
                                  </p>
                                )}

                              </div>

                              {/* ADD TO CART */}

                              <button
                                onClick={() =>
                                  handleAddToCart(
                                    product
                                  )
                                }
                                className="
                                  mt-5
                                  bg-[#7c3aed]
                                  text-white
                                  px-5
                                  py-3
                                  rounded-full
                                  hover:bg-black
                                  transition
                                  w-full
                                "
                              >
                                Add To Cart
                              </button>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                  {/* RIGHT ARROW */}

                  {rowProducts.length > 4 && (
                    <button
                      onClick={() =>
                        scrollRowRight(
                          rowIndex
                        )
                      }
                      className="
                        absolute
                        right-1
                        sm:right-3
                        top-1/2
                        -translate-y-1/2
                        z-30
                        bg-white
                        w-12
                        h-12
                        sm:w-14
                        sm:h-14
                        rounded-full
                        shadow-xl
                        flex
                        items-center
                        justify-center
                        text-xl
                        hover:bg-black
                        hover:text-white
                        transition
                      "
                    >
                      <FaChevronRight />
                    </button>
                  )}

                </div>
              )
            )}

          </div>
        )}

      </section>

    </div>
  );
}