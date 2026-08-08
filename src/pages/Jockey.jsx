import { useState } from "react";

import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";

import Navbar from "../components/Navbar";

import {
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function Jockey() {
  const { addToCart } = useCart();

  const {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const [popupMessage, setPopupMessage] =
    useState("");

  const sizes = [
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ];

  const products = [
    {
      id: 1,
      title: "2714 T-Shirt Jockey",
      category: "T-Shirt",
      price: 999,
      sizes,
      colors: {
        black:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200",
        white:
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200",
        red:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200",
        blue:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200",
      },
    },

    {
      id: 2,
      title: "AM44 Lower",
      category: "Lower",
      price: 1499,
      sizes,
      colors: {
        black:
          "https://images.unsplash.com/photo-1506629905607-d9c36e0b7b5b?q=80&w=1200",
        gray:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200",
        navy:
          "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200",
        green:
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200",
      },
    },

    {
      id: 3,
      title: "SP27 Lower Slim Fit",
      category: "Lower",
      price: 1699,
      sizes,
      colors: {
        black:
          "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1200",
        blue:
          "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1200",
        brown:
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200",
        gray:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200",
      },
    },

    {
      id: 4,
      title: "3911 Polo T-Shirt",
      category: "Polo",
      price: 1299,
      sizes,
      colors: {
        black:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200",
        yellow:
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200",
        white:
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200",
        red:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200",
      },
    },

    {
      id: 5,
      title: "AM12 Shorts",
      category: "Shorts",
      price: 999,
      sizes,
      colors: {
        black:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200",
        gray:
          "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200",
        green:
          "https://images.unsplash.com/photo-1506629905607-d9c36e0b7b5b?q=80&w=1200",
        blue:
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200",
      },
    },

    {
      id: 6,
      title: "9928 Tank Top",
      category: "Tank Top",
      price: 799,
      sizes,
      colors: {
        black:
          "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200",
        white:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200",
        orange:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200",
        cyan:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200",
      },
    },

    {
      id: 7,
      title: "7099 Socks",
      category: "Socks",
      price: 299,
      sizes,
      colors: {
        black:
          "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1200",
        white:
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200",
        blue:
          "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?q=80&w=1200",
        red:
          "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=1200",
      },
    },

    {
      id: 8,
      title: "7106 Socks",
      category: "Socks",
      price: 349,
      sizes,
      colors: {
        black:
          "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1200",
        gray:
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200",
        navy:
          "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?q=80&w=1200",
        green:
          "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=1200",
      },
    },
  ];

  const showPopupMessage = (message) => {
    setPopupMessage(message);

    setTimeout(() => {
      setPopupMessage("");
    }, 2000);
  };

  const toggleWishlist = (product) => {
    const exists = wishlistItems.find(
      (item) => item.id === product.id
    );

    if (exists) {
      removeFromWishlist(product.id);

      showPopupMessage(
        "Removed From Wishlist ❌"
      );
    } else {
      addToWishlist(product);

      showPopupMessage(
        "Added To Wishlist ❤️"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7ed]">
      {popupMessage && (
        <div className="fixed top-1/2 left-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2">
          <div className="bg-gradient-to-br from-gray-200 to-gray-400 text-[#1f2937] px-10 py-5 rounded-[25px] shadow-2xl text-xl font-bold animate-bounce">
            {popupMessage}
          </div>
        </div>
      )}

      <Navbar variant="page" />

      <div className="px-5 pt-6">
        <div className="bg-[#7c3aed] text-white rounded-[40px] px-10 py-12 shadow-2xl">
          <p className="uppercase tracking-[6px] text-sm text-gray-400 font-medium">
            Premium Brand Collection
          </p>

          <h1 className="text-7xl font-black mt-4 leading-none">
            JOCKEY COLLECTION
          </h1>

          <p className="text-gray-300 mt-6 text-lg max-w-3xl leading-8">
            Explore premium fashion collections,
            trendy products, shorts, lowers,
            polo t-shirts, socks and more.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 p-3 sm:p-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            wishlistItems={wishlistItems}
            showPopupMessage={showPopupMessage}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  addToCart,
  toggleWishlist,
  wishlistItems,
  showPopupMessage,
}) {
  const colorKeys = Object.keys(product.colors);

  const [selectedColor, setSelectedColor] =
    useState(colorKeys[0]);

  const [selectedSize, setSelectedSize] =
    useState(product.sizes[0]);

  const [startIndex, setStartIndex] =
    useState(0);

  const visibleColors = colorKeys.slice(
    startIndex,
    startIndex + 3
  );

  return (
    <div className="bg-white rounded-2xl sm:rounded-[30px] border border-orange-100 overflow-hidden shadow-md hover:shadow-2xl transition duration-500">
      <div className="relative overflow-hidden">
        <img
          src={product.colors[selectedColor]}
          alt=""
          className="h-[140px] sm:h-[320px] w-full object-cover hover:scale-110 transition duration-500"
        />

        <button
          onClick={() =>
            toggleWishlist({
              ...product,
              image:
                product.colors[selectedColor],
              name: product.title,
              selectedColor,
              selectedSize,
            })
          }
          className={`absolute top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-base ${
            wishlistItems.find(
              (item) => item.id === product.id
            )
              ? "bg-red-500 text-white"
              : "bg-white"
          }`}
        >
          <FaHeart />
        </button>
      </div>

      <div className="p-2.5 sm:p-5">
        <div className="flex justify-between gap-1">
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-lg line-clamp-1">
              {product.title}
            </h3>

            <p className="text-gray-500 text-[10px] sm:text-sm">
              {product.category}
            </p>
          </div>

          <p className="font-bold text-xs sm:text-lg shrink-0">
            ₹{product.price}
          </p>
        </div>

        <div className="mt-4">
          <p className="font-semibold text-[11px] sm:text-base mb-1 sm:mb-2">
            Colors
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setStartIndex(
                  Math.max(startIndex - 1, 0)
                )
              }
            >
              <FaChevronLeft />
            </button>

            <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
              {visibleColors.map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    setSelectedColor(color)
                  }
                  className={`min-w-[28px] h-[28px] sm:min-w-[45px] sm:h-[45px] rounded-full border-2 sm:border-4 shadow-md transition-all duration-300 ${
                    selectedColor === color
                      ? "border-orange-200 scale-110"
                      : "border-orange-200 hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: color,
                  }}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setStartIndex(
                  Math.min(
                    startIndex + 1,
                    colorKeys.length - 3
                  )
                )
              }
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="font-semibold text-[11px] sm:text-base mb-1 sm:mb-2">
            Sizes
          </p>

          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() =>
                  setSelectedSize(size)
                }
                className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border text-[11px] sm:text-sm ${
                  selectedSize === size
                    ? "bg-[#7c3aed] text-white"
                    : "bg-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            addToCart({
              ...product,
              image:
                product.colors[selectedColor],
              name: product.title,
              selectedColor,
              selectedSize,
            });

            showPopupMessage(
              "Added To Cart 🛒"
            );
          }}
          className="mt-3 sm:mt-5 w-full bg-[#7c3aed] text-white text-xs sm:text-base py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-[#1e1b4b] transition"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}