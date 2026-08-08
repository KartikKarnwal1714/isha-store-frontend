import {
  FaTag,
  FaGift,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useCart } from "../../CartContext";

export default function PriceSummary() {
  const navigate = useNavigate();

  const {
  subtotal,
  shipping,
  tax,
  discount,
  grandTotal,
  totalItems,
  selectedAddress,
  cartItems,
} = useCart();

  const platformFee = 20;

  const finalTotal =
    grandTotal + platformFee;

  return (
    <div className="sticky top-24">

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">

          <h2 className="text-2xl font-bold">
            Order Summary
          </h2>

          <p className="text-indigo-100 mt-2">
            {totalItems} Item(s) in your cart
          </p>

        </div>

        <div className="p-6">

          {/* Coupon */}

          <div className="border rounded-2xl p-4 flex justify-between items-center">

            <div className="flex items-center gap-3">

              <FaTag className="text-indigo-600" />

              <div>

                <h4 className="font-semibold">
                  Apply Coupon
                </h4>

                <p className="text-sm text-gray-500">
                  Save more on this order
                </p>

              </div>

            </div>

            <button className="text-indigo-600 font-semibold">

              Apply

            </button>

          </div>

          {/* Gift Wrap */}

          <div className="border rounded-2xl p-4 flex justify-between items-center mt-4">

            <div className="flex items-center gap-3">

              <FaGift className="text-pink-500" />

              <div>

                <h4 className="font-semibold">
                  Gift Wrap
                </h4>

                <p className="text-sm text-gray-500">
                  ₹49 Extra
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              className="w-5 h-5"
            />

          </div>

          {/* Price Details */}

          <div className="mt-8">

            <h3 className="font-bold text-xl mb-5">
              Price Details
            </h3>

            <div className="space-y-4">

              <div className="flex justify-between">

                <span>Subtotal</span>

                <span>₹{subtotal}</span>

              </div>

              <div className="flex justify-between">

                <span>Shipping</span>

                <span className="text-green-600">

                  {shipping === 0
                    ? "FREE"
                    : `₹${shipping}`}

                </span>

              </div>

              <div className="flex justify-between">

                <span>Platform Fee</span>

                <span>

                  ₹{platformFee}

                </span>

              </div>

              <div className="flex justify-between">

                <span>GST (18%)</span>

                <span>

                  ₹{tax}

                </span>

              </div>

              <div className="flex justify-between text-green-600">

                <span>Discount</span>

                <span>

                  -₹{discount}

                </span>

              </div>

            </div>

          </div>

          <hr className="my-6" />

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-500">
                Total Amount
              </p>

              <h2 className="text-4xl font-black">

                ₹{finalTotal}

              </h2>

            </div>

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">

              Saved ₹{discount}

            </span>

          </div>

          {/* Security */}

          <div className="bg-green-50 rounded-2xl p-4 mt-6 flex gap-3">

            <FaShieldAlt className="text-green-600 mt-1" />

            <div>

              <h4 className="font-semibold">

                Secure Checkout

              </h4>

              <p className="text-sm text-gray-600">

                Your payment is protected using
                industry-standard encryption.

              </p>

            </div>

          </div>

          {/* Payment Button */}

          <button
  disabled={
    cartItems.length === 0 || !selectedAddress
  }
  onClick={() => navigate("/payment")}
  className={`w-full mt-8 py-5 rounded-2xl font-bold text-lg flex justify-center items-center gap-3 transition ${
    cartItems.length === 0 || !selectedAddress
      ? "bg-gray-300 cursor-not-allowed text-gray-600"
      : "bg-indigo-600 hover:bg-indigo-700 text-white"
  }`}
>
  Proceed to Payment
  <FaArrowRight />
</button>

          <p className="text-center text-gray-400 text-sm mt-5">

            By continuing you agree to our
            Terms & Conditions.

          </p>

        </div>

      </div>

    </div>
  );
}