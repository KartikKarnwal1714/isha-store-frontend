import { FaHeart, FaTrash } from "react-icons/fa";

import { Link } from "react-router-dom";

import { useWishlist } from "../WishlistContext";
import { useCart } from "../CartContext";
import Navbar from "../components/Navbar";

export default function Wishlist() {
  const {
    wishlistItems,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const getWishlistPrice = (item) => {
    return Number(
      item.price ||
        item.colors?.[0]?.sizes?.[0]?.price ||
        0
    );
  };

  const getWishlistOriginalPrice = (item) => {
    return Number(
      item.originalPrice ||
        item.colors?.[0]?.sizes?.[0]?.originalPrice ||
        0
    );
  };

  const handleAddToCart = (item) => {
    const defaultColor = item.colors?.[0] || null;
    const defaultSize = item.colors?.[0]?.sizes?.[0] || null;

    addToCart({
      ...item,
      title: item.title || item.name,
      image: item.images?.[0] || item.image,
      price:
        Number(defaultSize?.price) > 0
          ? defaultSize.price
          : item.price,
      originalPrice:
        Number(defaultSize?.originalPrice) > 0
          ? defaultSize.originalPrice
          : item.originalPrice,
      selectedColor:
        item.selectedColor ||
        defaultColor?.colorName ||
        "Default",
      selectedSize:
        item.selectedSize ||
        defaultSize?.size ||
        "Default",
      quantity: 1,
    });
  };

  return (

    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}

      <Navbar variant="page" />

      {/* PAGE CONTENT */}

      <div className="px-8 py-14">

        {/* HEADING */}

        <div className="flex items-center justify-between mb-14">

          <div>

            <h1 className="text-5xl font-black text-[#7c3aed]">
              MY WISHLIST
            </h1>

            <p className="text-gray-500 mt-3 text-lg">
              Your saved favourite products
            </p>

          </div>

          <Link to="/">

            <button className="bg-black text-white px-7 py-3 rounded-full hover:bg-gray-800 transition">

              Continue Shopping

            </button>

          </Link>

        </div>

        {/* EMPTY STATE */}

        {wishlistItems.length === 0 ? (

          <div className="bg-white rounded-[35px] p-16 text-center shadow-lg">

            <FaHeart className="text-7xl mx-auto text-red-400 mb-6" />

            <h2 className="text-3xl font-bold mb-4">
              Wishlist is Empty
            </h2>

            <p className="text-gray-500 text-lg">
              Save your favourite products here.
            </p>

            <Link to="/">

              <button className="mt-8 bg-[#7c3aed] text-white px-8 py-4 rounded-full hover:bg-[#6d28d9] transition font-semibold">

                Explore Products

              </button>

            </Link>

          </div>

        ) : (

          <>

            {/* TOTAL ITEMS */}

            <div className="mb-10">

              <p className="text-lg text-gray-600">

                Total Items:

                <span className="font-bold text-black ml-2">

                  {wishlistItems.length}

                </span>

              </p>

            </div>

            {/* PRODUCTS GRID */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">

              {wishlistItems.map((item) => (

                <div
                  key={item._id}
                  className="bg-white rounded-2xl sm:rounded-[30px] shadow-xl overflow-hidden group hover:shadow-2xl transition duration-300"
                >

                  {/* IMAGE */}

                  <div className="relative overflow-hidden">

                    <img
                      src={item.images?.[0] || item.image}
                      alt={item.title || item.name}
                      className="h-[150px] sm:h-[350px] w-full object-cover group-hover:scale-105 duration-500"
                    />

                    {/* REMOVE BUTTON */}

                    <button
                     onClick={() =>
                      removeFromWishlist(item._id || item.id)
                  }
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition text-xs sm:text-base"
                    >

                      <FaTrash />

                    </button>

                  </div>

                  {/* CONTENT */}

                  <div className="p-2.5 sm:p-5">

                    <div className="flex items-start justify-between gap-2 sm:gap-3">

                      <div className="min-w-0">

                        <h3 className="font-bold text-xs sm:text-xl line-clamp-2">
                          {item.title || item.name}
                        </h3>

                        <p className="text-gray-500 text-[10px] sm:text-sm mt-1">
                          {item.category}
                        </p>

                        {item.selectedSize && (

                          <p className="text-[10px] sm:text-sm text-gray-400 mt-1">

                            Size: {item.selectedSize}

                          </p>

                        )}

                      </div>

                      <FaHeart className="text-red-500 text-sm sm:text-xl flex-shrink-0" />

                    </div>

                    {/* PRICE */}

                    <p className="text-[#7c3aed] font-black text-sm sm:text-2xl mt-2 sm:mt-4">

                      ₹{getWishlistPrice(item)}

                    </p>

                    {getWishlistOriginalPrice(item) > 0 && (

                      <p className="text-gray-400 line-through text-[10px] sm:text-base">

                        ₹{getWishlistOriginalPrice(item)}

                      </p>

                    )}

                    {/* BUTTONS */}

                    <div className="flex flex-col gap-1.5 sm:gap-3 mt-3 sm:mt-6">

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-black text-white text-xs sm:text-base py-2 sm:py-3 rounded-lg sm:rounded-2xl hover:bg-gray-800 transition font-semibold"
                      >

                        Add To Cart

                      </button>

                      <button
                        onClick={() =>
                          removeFromWishlist(item._id)
                        }
                        className="w-full border border-red-500 text-red-500 text-xs sm:text-base py-2 sm:py-3 rounded-lg sm:rounded-2xl hover:bg-red-500 hover:text-white transition font-semibold"
                      >

                        Remove

                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>

    </div>

  );

}