import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";

import { FaHeart } from "react-icons/fa";

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
      selectedColor: defaultColor.colorName || "Default",
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

  const fetchBrandProducts = async () => {
    try {
      setLoading(true);

      const productRes = await fetch(
        `${API_URL}/products?brand=${encodeURIComponent(
          brandName
        )}`
      );

      const productData = await productRes.json();

      setProducts(productData.products || []);

      const brandRes = await fetch(
        `${API_URL}/brands`
      );

      const brandData = await brandRes.json();

      const selectedBrand = brandData.brands?.find(
        (item) =>
          item.name.toLowerCase() ===
          brandName.toLowerCase()
      );

      setBrand(selectedBrand || null);
    } catch (error) {
      console.log("Brand Products Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandProducts();
  }, [brandName]);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-[5000]">
          <div className="bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 px-10 py-6 rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.35)] border border-white/40 backdrop-blur-xl animate-bounce">
            <h2 className="text-2xl font-black text-black tracking-wide">
              {popup.text}
            </h2>
          </div>
        </div>
      )}

      <Navbar variant="page" />

      <section className="relative h-[420px] rounded-b-[50px] overflow-hidden bg-black">
        {brand?.bannerImage || brand?.brandImage ? (
          <img
            src={brand.bannerImage || brand.brandImage}
            alt={brand?.name}
            className="w-full h-full object-cover"
          />
        ) : null}

        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center px-10 md:px-20">
          <p className="text-white uppercase tracking-[4px]">
            Brand Collection
          </p>

          <h1
            className="text-6xl font-black mt-4"
            style={{
              color: brand?.nameColor || "#ffffff",
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

      <section className="px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black">
              {brand?.name || brandName} Products
            </h2>

            <p className="text-gray-500 mt-3">
              Showing all available products for this brand
            </p>
          </div>

          <Link
            to="/brands"
            className="bg-black text-white px-6 py-3 rounded-full"
          >
            Back to Brands
          </Link>
        </div>

        {loading ? (
          <p className="text-xl font-semibold">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow">
            <h3 className="text-3xl font-bold">
              No products found
            </h3>

            <p className="text-gray-500 mt-3">
              Add products with brand name "{brandName}" from admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {products.map((product) => {
              const isWishlisted = wishlistItems.find(
                (item) => item._id === product._id
              );

              const price = getProductPrice(product);
              const originalPrice = getProductOriginalPrice(product);

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl sm:rounded-[35px] overflow-hidden shadow-md hover:shadow-2xl transition duration-500 group"
                >
                  <div className="overflow-hidden relative">
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="h-[150px] sm:h-[350px] w-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    </Link>

                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg transition text-xs sm:text-base ${
                        isWishlisted
                          ? "bg-red-500 text-white"
                          : "bg-white hover:bg-black hover:text-white"
                      }`}
                    >
                      <FaHeart />
                    </button>
                  </div>

                  <div className="p-2.5 sm:p-6">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-xs sm:text-2xl font-bold hover:underline line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-gray-500 text-[10px] sm:text-base mt-1 sm:mt-2 line-clamp-1">
                      {product.category}{" "}
                      {product.subCategory
                        ? `/ ${product.subCategory}`
                        : ""}
                    </p>

                    <div className="flex justify-between items-center mt-2.5 sm:mt-5">
                      <div>
                        <p className="font-black text-sm sm:text-2xl">
                          ₹{price}
                        </p>

                        {originalPrice > 0 && (
                          <p className="text-gray-400 line-through text-[10px] sm:text-base">
                            ₹{originalPrice}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-black text-white text-[11px] sm:text-base px-3 py-1.5 sm:px-5 sm:py-3 rounded-full hover:bg-gray-800 transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}