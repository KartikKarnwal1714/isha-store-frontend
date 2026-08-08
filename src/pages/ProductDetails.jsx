import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import ReviewSection from "../components/ReviewSection";
import Navbar from "../components/Navbar";

import {
  FaArrowLeft,
  FaArrowRight,
  FaHeart,
} from "react-icons/fa";
import { API_URL } from "../utils/apiUrl";

export default function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } =
    useWishlist();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [
  frequentlyBoughtProducts,
  setFrequentlyBoughtProducts,
] = useState([]);

const [
  frequentlyBoughtLoading,
  setFrequentlyBoughtLoading,
] = useState(true);

  const [loading, setLoading] = useState(true);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const [colorStartIndex, setColorStartIndex] = useState(0);

  const [popup, setPopup] = useState({
    show: false,
    text: "",
  });


  const showPopupMessage = (message) => {
    setPopup({ show: true, text: message });

    setTimeout(() => {
      setPopup({ show: false, text: "" });
    }, 2000);
  };

  const getImage = (item) => {
    return (
      item?.colors?.[0]?.images?.[0] ||
      item?.images?.[0]?.url ||
      item?.images?.[0] ||
      item?.image ||
      "https://via.placeholder.com/600"
    );
  };

  const getPrice = (item) => {
    return Number(
      item?.colors?.[0]?.sizes?.[0]?.price || item?.price || 0
    );
  };

  const getOriginalPrice = (item) => {
    return Number(
      item?.colors?.[0]?.sizes?.[0]?.originalPrice ||
        item?.originalPrice ||
        0
    );
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setFrequentlyBoughtLoading(true);

      const productRes = await fetch(
        `${API_URL}/products/${id}`
      );

      const productData = await productRes.json();

      if (productData.success) {
        const foundProduct = productData.product;
        setProduct(foundProduct);

        const firstImage =
          foundProduct.colors?.[0]?.images?.[0] ||
          foundProduct.images?.[0]?.url ||
          foundProduct.images?.[0] ||
          foundProduct.image ||
          "";

        setSelectedImage(firstImage);

       const customer = JSON.parse(
  localStorage.getItem("customer") ||
    "null"
);

fetch(
  `${API_URL}/products/${foundProduct._id}/view`,
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      userId: customer?._id || null,
    }),
  }
).catch((viewError) => {
  console.log(
    "Product view tracking error:",
    viewError
  );
});

const recommendationRes = await fetch(
  `${API_URL}/products/${foundProduct._id}/recommendations?limit=8`
);

const recommendationData =
  await recommendationRes.json();

if (recommendationData.success) {
  setSimilarProducts(
    Array.isArray(
      recommendationData.recommendations
    )
      ? recommendationData.recommendations
      : []
  );
} else {
  setSimilarProducts([]);
}
try {
  setFrequentlyBoughtLoading(true);

  const frequentlyBoughtRes = await fetch(
    `${API_URL}/products/${foundProduct._id}/frequently-bought?limit=8`
  );

  const frequentlyBoughtData =
    await frequentlyBoughtRes.json();

  if (frequentlyBoughtData.success) {
    setFrequentlyBoughtProducts(
      Array.isArray(
        frequentlyBoughtData.products
      )
        ? frequentlyBoughtData.products
        : []
    );
  } else {
    setFrequentlyBoughtProducts([]);
  }
} catch (frequentlyBoughtError) {
  console.log(
    "Frequently bought error:",
    frequentlyBoughtError
  );

  setFrequentlyBoughtProducts([]);
} finally {
  setFrequentlyBoughtLoading(false);
}

      }
    } catch (error) {
      console.log("Product detail error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const selectedColor = product?.colors?.[selectedColorIndex];
  const selectedSize = selectedColor?.sizes?.[selectedSizeIndex];

  const productImages =
    selectedColor?.images?.length > 0
      ? selectedColor.images
      : product?.images?.map((img) => img.url || img) || [
          product?.image,
        ];

  const sellingPrice = Number(
    selectedSize?.price > 0 ? selectedSize.price : product?.price || 0
  );

  const originalPrice = Number(
    selectedSize?.originalPrice > 0
      ? selectedSize.originalPrice
      : product?.originalPrice || product?.mrp || product?.MRP || 0
  );

  const discount =
    originalPrice > sellingPrice
      ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
      : 0;

  const descriptionPoints =
    product?.description
      ?.split(".")
      .map((point) => point.trim())
      .filter(Boolean) || [];

  const isWishlisted = product
    ? wishlistItems.find((item) => item._id === product._id)
    : false;

  const getColorValue = (color) => {
    const name = color?.colorName?.toLowerCase()?.trim();

    const colorMap = {
      black: "#000000",
      white: "#ffffff",
      red: "#ff0000",
      blue: "#0000ff",
      green: "#008000",
      yellow: "#ffff00",
      pink: "#ffc0cb",
      purple: "#800080",
      grey: "#808080",
      gray: "#808080",
      orange: "#ffa500",
      brown: "#8b4513",
      navy: "#000080",
      cream: "#fffdd0",
      maroon: "#800000",
      beige: "#f5f5dc",
    };

    return color?.colorCode || colorMap[name] || name || "#000000";
  };

  const visibleColors = product?.colors?.slice(
    colorStartIndex,
    colorStartIndex + 4
  );

  const handlePrevColors = () => {
    if (colorStartIndex > 0) {
      setColorStartIndex(colorStartIndex - 1);
    }
  };

  const handleNextColors = () => {
    if (product?.colors && colorStartIndex + 4 < product.colors.length) {
      setColorStartIndex(colorStartIndex + 1);
    }
  };

  const handleColorSelect = (actualIndex) => {
    setSelectedColorIndex(actualIndex);
    setSelectedSizeIndex(0);

    const image =
      product.colors?.[actualIndex]?.images?.[0] ||
      product.images?.[0]?.url ||
      product.images?.[0] ||
      product.image ||
      "";

    setSelectedImage(image);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedColor) {
      showPopupMessage("Please select color ❌");
      return;
    }

    if (!selectedSize) {
      showPopupMessage("Please select size ❌");
      return;
    }

    if (Number(selectedSize.stock) <= 0) {
      showPopupMessage("Selected size is out of stock ❌");
      return;
    }

    addToCart({
      ...product,
      title: product.name,
      image: selectedImage,
      price: sellingPrice,
      originalPrice: originalPrice,
      selectedColor: selectedColor.colorName,
      selectedSize: selectedSize.size,
      quantity: 1,
    });

    showPopupMessage("Added To Cart 🛒");
  };

  const toggleWishlist = () => {
    if (!product) return;

    if (isWishlisted) {
      removeFromWishlist(product._id);
      showPopupMessage("Removed from Wishlist ❌");
    } else {
      addToWishlist({
        ...product,
        title: product.name,
        image: selectedImage,
        price: sellingPrice,
        originalPrice: originalPrice,
      });

      showPopupMessage("Added to Wishlist ❤️");
    }
  };

  const RecommendationProductCard = ({
  item,
}) => {
  const itemPrice = getPrice(item);
  const itemOriginalPrice =
    getOriginalPrice(item);

  return (
    <Link
      to={`/product/${item._id}`}
      className="min-w-[150px] sm:min-w-[260px] bg-white rounded-xl sm:rounded-[25px] shadow overflow-hidden hover:shadow-xl transition"
    >
      <img
        src={getImage(item)}
        alt={item.name}
        className="h-[150px] sm:h-[300px] w-full object-cover"
      />

      <div className="p-2.5 sm:p-5">
        <p className="text-gray-500 text-[11px] sm:text-base font-semibold">
          {item.brand}
        </p>

        <h3 className="text-xs sm:text-lg font-bold mt-1 line-clamp-2">
          {item.name}
        </h3>

        <div className="flex items-center gap-2 mt-1.5 sm:mt-3">
          <p className="text-sm sm:text-2xl font-black">
            ₹{itemPrice}
          </p>

          {itemOriginalPrice > itemPrice && (
            <p className="text-[10px] sm:text-sm text-gray-400 line-through">
              ₹{itemOriginalPrice}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-yellow-500">
            ★
          </span>

          <span className="font-bold">
            {Number(
              item.averageRating || 0
            ).toFixed(1)}
          </span>

          <span className="text-sm text-gray-500">
            ({item.totalReviews || 0})
          </span>
        </div>
      </div>
    </Link>
  );
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-black">
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-black">
        Product Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-[5000]">
          <div className="bg-white px-10 py-6 rounded-[30px] shadow-2xl border animate-bounce">
            <h2 className="text-2xl font-black text-black">
              {popup.text}
            </h2>
          </div>
        </div>
      )}

      <Navbar variant="page" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 grid lg:grid-cols-2 gap-6 sm:gap-14">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
          <div className="order-2 sm:order-1 flex sm:flex-col gap-2 sm:gap-4 sm:w-24 sm:max-h-[650px] overflow-x-auto sm:overflow-x-hidden sm:overflow-y-auto pb-1 sm:pb-0 sm:pr-2">
            {productImages?.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`rounded-xl sm:rounded-2xl overflow-hidden border-2 shrink-0 ${
                  selectedImage === img
                    ? "border-black"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-16 h-16 sm:w-full sm:h-24 object-cover"
                />
              </button>
            ))}
          </div>

          <div className="order-1 sm:order-2 flex-1 bg-white rounded-2xl sm:rounded-[35px] overflow-hidden shadow">
            <img
              src={selectedImage || "https://via.placeholder.com/600"}
              alt={product.name}
              className="w-full h-[280px] sm:h-[650px] object-cover"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-[35px] shadow p-4 sm:p-10">
          <p className="text-sm sm:text-xl font-bold text-gray-500">
            {product.brand}
          </p>

          <h1 className="text-xl sm:text-4xl font-black mt-2 sm:mt-3 leading-tight">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-end gap-2 sm:gap-4 mt-4 sm:mt-8">
            {discount > 0 && (
              <span className="text-base sm:text-3xl text-red-600">
                -{discount}%
              </span>
            )}

            <span className="text-2xl sm:text-5xl font-black">
              ₹{sellingPrice}
            </span>

            {originalPrice > 0 && (
              <span className="text-sm sm:text-2xl text-gray-400 line-through mb-0.5 sm:mb-2">
                M.R.P ₹{originalPrice}
              </span>
            )}
          </div>

          <p className="mt-2 sm:mt-3 text-xs sm:text-base text-gray-700">
            Inclusive of all taxes
          </p>

          <div className="mt-6 sm:mt-10">
            <h2 className="text-base sm:text-2xl font-black mb-2.5 sm:mb-5">
              Select Color
            </h2>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handlePrevColors}
                disabled={colorStartIndex === 0}
                className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition ${
                  colorStartIndex === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-black hover:text-white"
                }`}
              >
                <FaArrowLeft size={13} />
              </button>

              <div className="flex gap-2 sm:gap-4">
                {visibleColors?.length > 0 ? (
                  visibleColors.map((color, index) => {
                    const actualIndex = colorStartIndex + index;

                    return (
                      <button
                        key={actualIndex}
                        onClick={() => handleColorSelect(actualIndex)}
                        title={color.colorName}
                        className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full border-2 sm:border-4 shrink-0 transition ${
                          selectedColorIndex === actualIndex
                            ? "border-black scale-110"
                            : "border-gray-300"
                        }`}
                        style={{
                          backgroundColor: getColorValue(color),
                        }}
                      ></button>
                    );
                  })
                ) : (
                  <p className="text-red-500 font-semibold">
                    No color available
                  </p>
                )}
              </div>

              <button
                onClick={handleNextColors}
                disabled={
                  !product.colors ||
                  colorStartIndex + 4 >= product.colors.length
                }
                className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition ${
                  !product.colors ||
                  colorStartIndex + 4 >= product.colors.length
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-black hover:text-white"
                }`}
              >
                <FaArrowRight size={13} />
              </button>
            </div>
          </div>

          <div className="mt-5 sm:mt-8">
            <h2 className="text-base sm:text-2xl font-black mb-2.5 sm:mb-5">
              Select Size
            </h2>

            <div className="flex gap-2 sm:gap-4 flex-wrap">
              {selectedColor?.sizes?.length > 0 ? (
                selectedColor.sizes.map((size, index) => (
                  <button
                    key={index}
                    disabled={Number(size.stock) <= 0}
                    onClick={() => setSelectedSizeIndex(index)}
                    className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full border font-black text-xs sm:text-lg ${
                      selectedSizeIndex === index
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    } ${
                      Number(size.stock) <= 0
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {size.size}
                  </button>
                ))
              ) : (
                <p className="text-red-500 font-semibold">
                  No size available
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 sm:mt-10">
            <h2 className="text-base sm:text-2xl font-black mb-2 sm:mb-4">
              Product Description
            </h2>

            {descriptionPoints.length > 0 ? (
              <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-3 text-gray-700 text-xs sm:text-lg">
                {descriptionPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            ) : (
              <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-3 text-gray-700 text-xs sm:text-lg">
                <li>Premium quality product for daily use</li>
                <li>Comfortable fitting and stylish look</li>
                <li>Best choice for casual and regular wear</li>
                <li>Durable material with clean finishing</li>
              </ul>
            )}
          </div>

          <div className="flex gap-2 sm:gap-4 mt-6 sm:mt-10">
            <button
              onClick={handleAddToCart}
              disabled={
                !selectedColor ||
                !selectedSize ||
                Number(selectedSize?.stock) <= 0
              }
              className={`flex-1 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-xl font-black transition ${
                !selectedColor ||
                !selectedSize ||
                Number(selectedSize?.stock) <= 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {!selectedColor || !selectedSize
                ? "Unavailable"
                : Number(selectedSize?.stock) <= 0
                ? "Out of Stock"
                : "Add To Cart"}
            </button>

            <button
              onClick={toggleWishlist}
              className={`w-14 sm:w-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-2xl transition ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 hover:bg-black hover:text-white"
              }`}
            >
              <FaHeart />
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-16">
  <div className="border-t pt-6 sm:pt-10">
    <div className="mb-4 sm:mb-8">
      <p className="text-xs sm:text-sm uppercase tracking-[2px] sm:tracking-[4px] font-bold text-orange-500">
        Purchased together
      </p>

      <h2 className="text-xl sm:text-4xl font-black mt-1.5 sm:mt-2">
        Customers Also Bought
      </h2>

      <p className="text-gray-500 mt-2">
        Products commonly purchased with this
        item.
      </p>
    </div>

    {frequentlyBoughtLoading ? (
      <div className="py-12 text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

        <p className="text-gray-500 mt-4">
          Loading recommendations...
        </p>
      </div>
    ) : frequentlyBoughtProducts.length ===
      0 ? (
      <p className="text-xl font-semibold text-gray-500">
        No frequently bought products found.
      </p>
    ) : (
      <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-5">
        {frequentlyBoughtProducts.map(
          (item) => (
            <RecommendationProductCard
              key={item._id}
              item={item}
            />
          )
        )}
      </div>
    )}
  </div>
</section>

<section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-16">
  <div className="border-t pt-6 sm:pt-10">
    <h2 className="text-xl sm:text-4xl font-black mb-4 sm:mb-8">
      You May Also Like
    </h2>

    {similarProducts.length === 0 ? (
      <p className="text-xl font-semibold text-gray-500">
        No recommendations available for this product.
      </p>
    ) : (
      <div className="flex gap-3 sm:gap-6 overflow-x-auto pb-5">
        {similarProducts.map((item) => (
          <RecommendationProductCard
            key={item._id}
            item={item}
          />
        ))}
      </div>
    )}
  </div>
</section>

      <ReviewSection productId={product._id} />
    </div>
  );
}