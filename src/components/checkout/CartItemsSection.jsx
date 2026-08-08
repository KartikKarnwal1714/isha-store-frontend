import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaTruck,
  FaShoppingCart,
} from "react-icons/fa";

import { useCart } from "../../CartContext";

export default function CartItemsSection() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center">

        <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-6" />

        <h2 className="text-3xl font-bold">
          Your Cart is Empty
        </h2>

        <p className="text-gray-500 mt-3">
          Add some products to continue shopping.
        </p>

      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-2xl font-bold">
            Shopping Bag
          </h2>

          <p className="text-gray-500 mt-1">
            {cartItems.length} Item(s)
          </p>

        </div>

      </div>

      <div className="space-y-6">

        {cartItems.map((item) => {

          const price = Number(item.price || 0);

          const originalPrice = Number(
            item.originalPrice || price
          );

          const discount =
            originalPrice > price
              ? Math.round(
                  ((originalPrice - price) /
                    originalPrice) *
                    100
                )
              : 0;

          return (

            <div
              key={`${item._id}-${item.selectedSize}-${item.selectedColor}`}
              className="border rounded-3xl p-5 hover:shadow-lg transition"
            >

              <div className="flex flex-col lg:flex-row gap-6">

                {/* Product Image */}

                <img
                  src={
                    item.images?.[0] ||
                    item.image ||
                    "https://placehold.co/200x250?text=No+Image"
                  }
                  alt={item.name}
                  className="w-44 h-44 rounded-2xl object-cover"
                />

                {/* Product Info */}

                <div className="flex-1">

                  <div className="flex justify-between">

                    <div>

                      <h3 className="text-lg text-gray-500">
                        {item.brand}
                      </h3>

                      <h2 className="text-2xl font-bold mt-1">
                        {item.name}
                      </h2>

                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item._id)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={20} />
                    </button>

                  </div>

                  <div className="flex gap-3 mt-5 flex-wrap">

                    {item.selectedColor && (
                      <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                        Color : {item.selectedColor}
                      </span>
                    )}

                    {item.selectedSize && (
                      <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                        Size : {item.selectedSize}
                      </span>
                    )}

                  </div>

                  {/* Quantity */}

                  <div className="flex items-center gap-3 mt-6">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          "decrease"
                        )
                      }
                      className="w-10 h-10 rounded-full border hover:bg-gray-100"
                    >

                      <FaMinus />

                    </button>

                    <span className="font-bold text-xl">

                      {item.quantity}

                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          "increase"
                        )
                      }
                      className="w-10 h-10 rounded-full border hover:bg-gray-100"
                    >

                      <FaPlus />

                    </button>

                  </div>

                  {/* Price */}

                  <div className="flex items-center gap-4 mt-6 flex-wrap">

                    <span className="text-3xl font-black">

                      ₹{price}

                    </span>

                    {originalPrice > price && (
                      <>
                        <span className="line-through text-gray-400">
                          ₹{originalPrice}
                        </span>

                        <span className="text-green-600 font-bold">
                          {discount}% OFF
                        </span>
                      </>
                    )}

                  </div>

                  {/* Delivery */}

                  <div className="flex items-center gap-2 mt-6 text-green-700">

                    <FaTruck />

                    Free Delivery by Tomorrow

                  </div>

                </div>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
}