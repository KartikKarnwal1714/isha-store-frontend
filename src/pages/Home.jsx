import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API_URL } from "../utils/apiUrl";

import {
  FaHeart,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";

const getProductImage = (product) => {
  return (
    product.colors?.[0]?.images?.[0] ||
    product.images?.[0]?.url ||
    product.images?.[0] ||
    product.image ||
    "https://via.placeholder.com/500"
  );
};

const getProductPrice = (product) => {
  return Number(
    product.minimumPrice ||
      product.colors?.[0]?.sizes?.[0]
        ?.price ||
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

const ProductSlider = ({
  id,
  products,
  wishlistItems,
  onToggleWishlist,
  onAddToCart,
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => {
          document.getElementById(id).scrollBy({
            left: -500,
            behavior: "smooth",
          });
        }}
        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl hover:bg-[#7c3aed] hover:text-white transition w-14 h-14 rounded-full text-2xl items-center justify-center"
      >
        ❮
      </button>

      <button
        onClick={() => {
          document.getElementById(id).scrollBy({
            left: 500,
            behavior: "smooth",
          });
        }}
        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl hover:bg-[#7c3aed] hover:text-white transition w-14 h-14 rounded-full text-2xl items-center justify-center"
      >
        ❯
      </button>

      <div
        id={id}
        className="flex gap-3 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
      >
        {products.map((product, index) => (
          <div
            key={product._id || index}
            className="min-w-[46%] max-w-[46%] sm:min-w-[30%] sm:max-w-[30%] lg:min-w-[22%] lg:max-w-[22%] flex-shrink-0 group"
          >
            <div className="bg-[#fff7ed] rounded-2xl sm:rounded-[35px] overflow-hidden shadow-lg">
              <div className="overflow-hidden relative">
                <img
                  src={getProductImage(product)}
                  alt=""
                  className="h-[160px] sm:h-[260px] lg:h-[330px] w-full object-cover group-hover:scale-105 duration-500"
                />

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`absolute top-2 right-2 sm:top-5 sm:right-5 w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg transition text-xs sm:text-base ${
                    wishlistItems.find((item) => item._id === product._id)
                      ? "bg-red-500 text-white"
                      : "bg-white hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <FaHeart />
                </button>
              </div>

              <div className="p-2.5 sm:p-5">
                <h3 className="font-bold text-sm sm:text-xl line-clamp-1">
                  {product.title || product.name}
                </h3>

                <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-1">
                  {product.brand}
                </p>

                <div className="mt-1 sm:mt-2">
                  <p className="font-bold text-sm sm:text-lg text-[#7c3aed]">
                    ₹{getProductPrice(product)}
                  </p>

                  {getProductOriginalPrice(product) > 0 && (
                    <p className="text-xs sm:text-sm text-gray-400 line-through">
                      ₹{getProductOriginalPrice(product)}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onAddToCart(product)}
                  className="mt-2 sm:mt-5 w-full bg-[#7c3aed] text-white py-1.5 sm:py-3 text-xs sm:text-base rounded-xl sm:rounded-2xl hover:bg-[#6d28d9] transition font-medium"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [showMoreProducts, setShowMoreProducts] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [recommendedProducts, setRecommendedProducts] =
  useState([]);

const [
  recommendationsLoading,
  setRecommendationsLoading,
] = useState(true);

const [
  recommendationMessage,
  setRecommendationMessage,
] = useState("");

  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const navigate = useNavigate();

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

  // ======================================================
  // DELIVERY LOCATION BAR
  // ======================================================
  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("deliveryLocation") || "null"
      );
    } catch {
      return null;
    }
  });

  const [deliveryInput, setDeliveryInput] = useState("");
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [editingLocation, setEditingLocation] = useState(false);

  const saveDeliveryLocation = (location) => {
    setDeliveryLocation(location);
    setEditingLocation(false);
    setLocationError("");

    try {
      localStorage.setItem(
        "deliveryLocation",
        JSON.stringify(location)
      );
    } catch (storageError) {
      console.error(storageError);
    }
  };

  const checkDeliveryLocation = async () => {
    const query = deliveryInput.trim();

    if (!query) {
      setLocationError("Enter an address, city or pincode");
      return;
    }

    try {
      setCheckingLocation(true);
      setLocationError("");

      if (/^\d{6}$/.test(query)) {
        const response = await axios.get(
          `${API_URL}/location/pincode/${query}`
        );

        if (!response.data?.success) {
          throw new Error("Pincode not found");
        }

        saveDeliveryLocation({
          label: `${response.data.city}, ${response.data.state}`,
          pincode: query,
        });
      } else {
        const response = await axios.get(
          `${API_URL}/location/search`,
          {
            params: { q: query },
          }
        );

        if (!response.data?.success) {
          throw new Error("Location not found");
        }

        saveDeliveryLocation({
          label:
            [response.data.city, response.data.state]
              .filter(Boolean)
              .join(", ") || query,
          pincode: response.data.pincode || "",
        });
      }
    } catch (checkError) {
      console.error("Delivery location check error:", checkError);

      setLocationError(
        "Could not find that location. Try a different city name or pincode."
      );
    } finally {
      setCheckingLocation(false);
    }
  };

  const detectDeliveryLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    setCheckingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await axios.get(
            `${API_URL}/location/reverse`,
            {
              params: { lat: latitude, lon: longitude },
            }
          );

          if (!response.data?.success) {
            throw new Error("Reverse geocoding failed");
          }

          saveDeliveryLocation({
            label:
              [response.data.city, response.data.state]
                .filter(Boolean)
                .join(", ") || "Detected location",
            pincode: response.data.pincode || "",
          });
        } catch (detectError) {
          console.error("Auto-detect location error:", detectError);
        } finally {
          setCheckingLocation(false);
        }
      },
      () => {
        // Permission denied or unavailable — silently fall back
        // to manual entry, no error shown on first-load auto-detect.
        setCheckingLocation(false);
      }
    );
  };

  useEffect(() => {
    if (deliveryLocation) {
      return;
    }

    // If the customer is logged in and already has a saved
    // default address (e.g. from completing their profile,
    // or on a fresh device with no cached location), use
    // that instead of guessing from GPS.
    try {
      const savedCustomer = JSON.parse(
        localStorage.getItem("customer") || "null"
      );

      const defaultAddress = savedCustomer?.addresses?.find(
        (entry) => entry.isDefault
      ) || savedCustomer?.addresses?.[0];

      if (defaultAddress?.city) {
        saveDeliveryLocation({
          label: [defaultAddress.city, defaultAddress.state]
            .filter(Boolean)
            .join(", "),
          pincode: defaultAddress.pincode || "",
        });

        return;
      }
    } catch (parseError) {
      console.error(parseError);
    }

    detectDeliveryLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const heroSlides = [
    {
      title: "OGY",
      subtitle: "Fashion • Cosmetics • Jewellery",
      description:
        "One store for clothes, beauty, jewellery, accessories and lifestyle products.",
      images: [
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      title: "STYLE FOR EVERYONE",
      subtitle: "Men • Women • Kids",
      description:
        "Shop fresh clothing collections for every age, every season and every occasion.",
      images: [
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593032465171-8bdcf53d0f2f?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      title: "BEAUTY & CARE",
      subtitle: "Skincare • Makeup • Grooming",
      description:
        "Explore cosmetics, perfumes, face wash, creams, shampoos and grooming essentials.",
      images: [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?q=80&w=500&auto=format&fit=crop",
      ],
    },
    {
      title: "LIFESTYLE PICKS",
      subtitle: "Accessories • Jewellery • Daily Needs",
      description:
        "Find jewellery, caps, bottles, towels, umbrellas and useful lifestyle products.",
      images: [
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=500&auto=format&fit=crop",
      ],
    },
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products`);

        setAllProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.log("Error fetching products", error);
        setAllProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
  const fetchRecommendations = async () => {
    let customer = null;

    try {
      customer = JSON.parse(
        localStorage.getItem("customer") ||
          "null"
      );
    } catch (error) {
      console.error(
        "Customer data parse error:",
        error
      );
    }

    try {
      setRecommendationsLoading(true);

      if (customer?._id) {
        const response = await axios.get(
          `${API_URL}/products/recommendations/customer/${customer._id}?limit=36`
        );

        const products = Array.isArray(
          response.data?.recommendations
        )
          ? response.data.recommendations
          : [];

        setRecommendedProducts(products);

        setRecommendationMessage(
          response.data?.personalized
            ? "Based on products you recently viewed"
            : "Popular products selected for you"
        );
      } else {
        const response = await axios.get(
          `${API_URL}/products`,
          {
            params: {
              inStock: true,
              sort: "mostSold",
              limit: 36,
            },
          }
        );

        const products = Array.isArray(
          response.data
        )
          ? response.data
          : Array.isArray(
              response.data?.products
            )
          ? response.data.products
          : [];

        setRecommendedProducts(products);

        setRecommendationMessage(
          "Popular products you may like"
        );
      }
    } catch (error) {
      console.error(
        "Recommendation fetch error:",
        error.response?.data ||
          error.message
      );

      setRecommendedProducts([]);
      setRecommendationMessage(
        "Recommendations are currently unavailable"
      );
    } finally {
      setRecommendationsLoading(false);
    }
  };

  fetchRecommendations();
}, []);

  const featuredCategories = [
    {
      title: "T-Shirts",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Lowers",
      image:
        "https://images.unsplash.com/photo-1506629905607-d9c297d5d95f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Gym Fit",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Swimming Costumes",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Jeans",
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Cargo Pants",
      image:
        "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Shampoo",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Face Cream",
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const moreCategories = [
    {
      title: "Perfumes",
      image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Body Wash",
      image:
        "https://images.unsplash.com/photo-1556228578-dd6c7c4f0c89?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Makeup",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Caps",
      image:
        "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Towels",
      image:
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Bottles",
      image:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const safeProducts = Array.isArray(allProducts) ? allProducts : [];

  const newDrops = [...safeProducts]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.updatedAt || 0) -
        new Date(a.createdAt || a.updatedAt || 0)
    )
    .slice(0, 12);

  const mostSoldProducts = [...safeProducts].sort(
    (a, b) =>
      Number(b.sold || b.totalSold || b.orderCount || b.sales || 0) -
      Number(a.sold || a.totalSold || a.orderCount || a.sales || 0)
  );

  const mostSoldRow1 = mostSoldProducts.slice(0, 12);
  const mostSoldRow2 = mostSoldProducts.slice(12, 24);
  const mostSoldRow3 = mostSoldProducts.slice(24, 36);

  const recommendedRow1 = recommendedProducts.slice(0, 12);
  const recommendedRow2 = recommendedProducts.slice(12, 24);
  const recommendedRow3 = recommendedProducts.slice(24, 36);

  const getDefaultColor = (product) => {
    return product.colors?.[0] || null;
  };

  const getDefaultSize = (product) => {
    return product.colors?.[0]?.sizes?.[0] || null;
  };

  const handleAddToCart = async (product) => {
    const defaultColor = getDefaultColor(product);
    const defaultSize = getDefaultSize(product);

    if (!defaultColor || !defaultSize) {
      showPopupMessage("Product options are not available ❌");
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
      selectedColor: defaultColor.colorName || "Default",
      selectedSize: defaultSize.size || "Default",
      price: Number(defaultSize.price) > 0 ? defaultSize.price : product.price,
      originalPrice:
        Number(defaultSize.originalPrice) > 0
          ? defaultSize.originalPrice
          : product.originalPrice,
      quantity: 1,
    });

    const customer = JSON.parse(localStorage.getItem("customer"));

    if (customer?._id) {
      try {
        await axios.post(`${API_URL}/cart/add`, {
          userId: customer._id,
          productId: product._id,
          quantity: 1,
          color: defaultColor.colorName || "Default",
          size: defaultSize.size || "Default",
        });
      } catch (error) {
        console.log("Cart API error:", error);
      }
    }

    showPopupMessage("Added To Cart 🛒");
  };

  const toggleWishlist = async (product) => {
    const customer = JSON.parse(localStorage.getItem("customer"));

    if (!customer?._id) {
      navigate("/login");
      return;
    }

    const exists = wishlistItems.find((item) => item._id === product._id);
    const defaultSize = getDefaultSize(product);

    try {
      if (exists) {
        removeFromWishlist(product._id);

        await axios.post(`${API_URL}/wishlist/remove`, {
          userId: customer._id,
          productId: product._id,
        });

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

        await axios.post(`${API_URL}/wishlist/add`, {
          userId: customer._id,
          productId: product._id,
        });

        showPopupMessage("Added to Wishlist ❤️");
      }
    } catch (error) {
      console.log("Wishlist API error:", error);
      showPopupMessage("Wishlist update failed ❌");
    }
  };

  return (
    <div className="bg-[#fff7ed] min-h-screen text-[#1f2937] overflow-hidden pt-[64px] sm:pt-[90px]">
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-[5000]">
          <div className="bg-white px-10 py-6 rounded-[30px] shadow-2xl border border-orange-200 animate-bounce">
            <h2 className="text-2xl font-black text-[#7c3aed]">
              {popup.text}
            </h2>
          </div>
        </div>
      )}

      <Navbar variant="home" />

      <div className="px-4 sm:px-8 py-3 sm:py-5 border-b border-orange-100 bg-[#ffedd5] text-sm sm:text-base">
        {deliveryLocation && !editingLocation ? (
          <div className="flex flex-wrap items-center gap-3">
            <FaMapMarkerAlt className="text-[#7c3aed] text-xl" />

            <p className="font-semibold">
              Delivering to:{" "}
              <span className="font-black">
                {deliveryLocation.label}
                {deliveryLocation.pincode
                  ? ` - ${deliveryLocation.pincode}`
                  : ""}
              </span>
            </p>

            <button
              type="button"
              onClick={() => {
                setDeliveryInput(deliveryLocation.label || "");
                setEditingLocation(true);
              }}
              className="ml-2 text-[#7c3aed] font-bold underline hover:no-underline"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full lg:max-w-xl">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={deliveryInput}
                onChange={(event) =>
                  setDeliveryInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    checkDeliveryLocation();
                  }
                }}
                placeholder="Enter delivery address, city or pincode"
                className="w-full border border-orange-200 px-5 py-3 rounded-full outline-none focus:border-[#7c3aed] bg-white"
              />

              <button
                type="button"
                onClick={checkDeliveryLocation}
                disabled={checkingLocation}
                className="bg-[#7c3aed] text-white px-7 py-3 rounded-full hover:bg-[#6d28d9] transition font-medium disabled:opacity-50"
              >
                {checkingLocation ? "Checking..." : "Check"}
              </button>

              {deliveryLocation && (
                <button
                  type="button"
                  onClick={() => setEditingLocation(false)}
                  className="w-11 h-11 flex-shrink-0 rounded-full border border-orange-200 flex items-center justify-center hover:bg-black hover:text-white transition"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={detectDeliveryLocation}
              className="self-start text-sm font-bold text-[#7c3aed] hover:underline"
            >
              📍 Use my current location
            </button>

            {locationError && (
              <p className="text-sm font-semibold text-red-600">
                {locationError}
              </p>
            )}
          </div>
        )}
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#6d28d9] to-[#c2410c]">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-6 sm:gap-10 items-center px-4 sm:px-10 lg:px-20 py-8 sm:py-14">
          <div className="text-white max-w-2xl">
            <p className="inline-block bg-white/20 backdrop-blur-md px-3 py-1.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-widest mb-4 sm:mb-8">
              WELCOME TO OGY
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black leading-tight">
              {heroSlides[currentImage].title}
            </h1>

            <h2 className="mt-2 sm:mt-5 text-lg sm:text-2xl lg:text-3xl font-bold text-yellow-300">
              {heroSlides[currentImage].subtitle}
            </h2>

            <p className="mt-3 sm:mt-6 text-sm sm:text-lg text-white/90 leading-relaxed sm:leading-8 max-w-xl">
              {heroSlides[currentImage].description}
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-5 mt-5 sm:mt-9">
              <Link to="/men">
                <button className="bg-yellow-300 text-black px-5 py-2.5 sm:px-10 sm:py-4 text-sm sm:text-base rounded-full font-bold hover:bg-white transition">
                  Shop Now
                </button>
              </Link>

              <Link to="/cosmetics">
                <button className="border border-white text-white px-5 py-2.5 sm:px-10 sm:py-4 text-sm sm:text-base rounded-full font-bold hover:bg-white hover:text-black transition">
                  Explore Store
                </button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 h-[180px] sm:h-[320px] lg:h-[450px]">
            {heroSlides[currentImage].images.slice(0, 8).map((img, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg sm:rounded-[25px] shadow-2xl bg-white/20"
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative sm:absolute sm:bottom-8 left-1/2 sm:-translate-x-1/2 flex justify-center gap-2 sm:gap-3 z-20 pb-4 sm:pb-0">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 sm:h-3 rounded-full transition-all ${
                currentImage === index
                  ? "w-8 sm:w-12 bg-yellow-300"
                  : "w-2 sm:w-3 bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-8 py-10 sm:py-20 bg-[#fff7ed]">
        <div className="mb-6 sm:mb-14">
          <h2 className="text-2xl sm:text-5xl font-black text-[#1e1b4b]">
            Featured Categories
          </h2>

          <p className="text-gray-600 mt-1.5 sm:mt-3 text-sm sm:text-lg">
            Shop fashion, beauty and lifestyle categories
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => {
              document.getElementById("categorySlider").scrollBy({
                left: -500,
                behavior: "smooth",
              });
            }}
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#7c3aed] hover:text-white transition w-14 h-14 rounded-full shadow-lg text-2xl items-center justify-center"
          >
            ❮
          </button>

          <button
            onClick={() => {
              document.getElementById("categorySlider").scrollBy({
                left: 500,
                behavior: "smooth",
              });
            }}
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#7c3aed] hover:text-white transition w-14 h-14 rounded-full shadow-lg text-2xl items-center justify-center"
          >
            ❯
          </button>

          <div
            id="categorySlider"
            className="flex gap-3 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
          >
            {featuredCategories.map((item, index) => (
              <div
                key={index}
                className="min-w-[46%] max-w-[46%] sm:min-w-[30%] sm:max-w-[30%] lg:min-w-[22%] lg:max-w-[22%] flex-shrink-0 group cursor-pointer"
              >
                <div className="relative h-[200px] sm:h-[320px] lg:h-[430px] rounded-2xl sm:rounded-[35px] overflow-hidden bg-white shadow-xl">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover object-center group-hover:scale-110 duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute bottom-3 left-3 sm:bottom-8 sm:left-8 text-white">
                    <h3 className="text-base sm:text-3xl font-black">{item.title}</h3>

                    <button className="mt-2 sm:mt-4 bg-yellow-300 text-black px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-base font-bold hover:bg-white transition">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-14">
          <button
            onClick={() => setShowMoreProducts(!showMoreProducts)}
            className="bg-[#7c3aed] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#6d28d9] transition"
          >
            {showMoreProducts ? "Show Less Categories" : "View More Categories"}
          </button>
        </div>

        {showMoreProducts && (
          <div className="mt-8 sm:mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
            {moreCategories.map((item, index) => (
              <div
                key={index}
                className="relative h-[140px] sm:h-[280px] rounded-2xl sm:rounded-[30px] overflow-hidden shadow-xl group"
              >
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-5 text-white">
                  <h3 className="text-sm sm:text-2xl font-black">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="px-4 sm:px-8 py-10 sm:py-20 bg-white">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-5xl font-black text-[#1e1b4b]">
            NEWLY DROPPED
          </h2>

          <p className="text-gray-500 mt-3 text-lg">
            Fresh arrivals picked just for you — explore the latest styles before they sell out.
          </p>
        </div>

        {loadingProducts ? (
          <p className="text-center text-gray-500 text-lg">
            Loading products...
          </p>
        ) : newDrops.length > 0 ? (
          <ProductSlider
            id="newDropSlider"
            products={newDrops}
            wishlistItems={wishlistItems}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
          />
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No newly added products found
          </p>
        )}
      </section>

      <section className="px-4 sm:px-8 py-10 sm:py-20 bg-[#fff7ed]">
        <h2 className="text-2xl sm:text-5xl font-black text-[#1e1b4b] mb-4">
          MOST SOLD PRODUCTS
        </h2>

        <p className="text-gray-500 text-sm sm:text-lg mb-6 sm:mb-14">
          Customer favorites loved by thousands — our best-selling products in one place.
        </p>

        {loadingProducts ? (
          <p className="text-center text-gray-500 text-lg">
            Loading products...
          </p>
        ) : (
          <div className="space-y-16">
            {mostSoldRow1.length > 0 && (
              <ProductSlider
                id="mostSoldSlider1"
                products={mostSoldRow1}
                wishlistItems={wishlistItems}
                onToggleWishlist={toggleWishlist}
                onAddToCart={handleAddToCart}
              />
            )}

            {mostSoldRow2.length > 0 && (
              <ProductSlider
                id="mostSoldSlider2"
                products={mostSoldRow2}
                wishlistItems={wishlistItems}
                onToggleWishlist={toggleWishlist}
                onAddToCart={handleAddToCart}
              />
            )}

            {mostSoldRow3.length > 0 && (
              <ProductSlider
                id="mostSoldSlider3"
                products={mostSoldRow3}
                wishlistItems={wishlistItems}
                onToggleWishlist={toggleWishlist}
                onAddToCart={handleAddToCart}
              />
            )}
          </div>
        )}
      </section>

      <section className="px-4 sm:px-8 py-10 sm:py-20 bg-gradient-to-b from-white to-[#fff7ed]">
  <div className="max-w-[1500px] mx-auto">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
      <div>
        <p className="text-sm uppercase tracking-[5px] font-black text-[#7c3aed]">
          Picked specially for you
        </p>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#1e1b4b] mt-2 sm:mt-3">
          Recommended For You
        </h2>

        <p className="text-gray-500 mt-3 text-lg">
          {recommendationMessage}
        </p>
      </div>

      {recommendedProducts.length >
        0 && (
        <Link
          to="/search"
          className="inline-flex items-center justify-center border-2 border-[#7c3aed] text-[#7c3aed] px-7 py-3 rounded-full font-bold hover:bg-[#7c3aed] hover:text-white transition"
        >
          Explore More
        </Link>
      )}
    </div>

    {recommendationsLoading ? (
      <div className="py-16 text-center">
        <div className="w-14 h-14 border-4 border-gray-200 border-t-[#7c3aed] rounded-full animate-spin mx-auto" />

        <p className="mt-5 text-gray-500 font-semibold">
          Preparing recommendations...
        </p>
      </div>
    ) : recommendedProducts.length ===
      0 ? (
      <div className="bg-white rounded-[30px] border p-14 text-center shadow-sm">
        <h3 className="text-2xl font-black">
          No Recommendations Yet
        </h3>

        <p className="text-gray-500 mt-3">
          Browse a few products and we will
          start suggesting products based on
          your interests.
        </p>

        <Link
          to="/search"
          className="inline-block mt-6 bg-[#7c3aed] text-white px-8 py-3 rounded-full font-bold"
        >
          Browse Products
        </Link>
      </div>
    ) : (
      <div className="space-y-16">
        {recommendedRow1.length > 0 && (
          <ProductSlider
            id="recommendedSlider1"
            products={recommendedRow1}
            wishlistItems={wishlistItems}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
          />
        )}

        {recommendedRow2.length > 0 && (
          <ProductSlider
            id="recommendedSlider2"
            products={recommendedRow2}
            wishlistItems={wishlistItems}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
          />
        )}

        {recommendedRow3.length > 0 && (
          <ProductSlider
            id="recommendedSlider3"
            products={recommendedRow3}
            wishlistItems={wishlistItems}
            onToggleWishlist={toggleWishlist}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    )}
  </div>
</section>

      <footer className="bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#7c2d12] text-white px-4 sm:px-8 py-10 sm:py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-3xl font-black tracking-[5px]">OGY</h2>

            <p className="mt-5 text-gray-300 leading-8 text-sm">
              OGY brings fashion, cosmetics, jewellery and daily
              lifestyle products together in one modern shopping experience.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-5">Shop</h3>

            <div className="space-y-4 text-gray-300 text-sm">
              <p>Men</p>
              <p>Women</p>
              <p>Kids</p>
              <p>Cosmetics</p>
              <p>Jewellery</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-5">Support</h3>

            <div className="space-y-4 text-gray-300 text-sm">
              <p>FAQs</p>
              <p>Shipping</p>
              <p>Returns</p>
              <p>Contact Us</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-5">Newsletter</h3>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-5 py-4 rounded-2xl text-black outline-none"
            />

            <button className="mt-5 w-full bg-yellow-300 text-black py-4 rounded-2xl font-semibold hover:bg-white transition">
              Subscribe
            </button>
          </div>
        </div>

        <div className="border-t border-white/20 mt-14 pt-8 text-center text-gray-300 text-sm">
          © 2026 OGY. All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}