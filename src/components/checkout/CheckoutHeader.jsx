import { Link } from "react-router-dom";
import { FaChevronRight, FaShoppingCart, FaCreditCard } from "react-icons/fa";

export default function CheckoutHeader() {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-6">

        <h1 className="text-xl sm:text-4xl font-black text-gray-900">
          Checkout
        </h1>

        <div className="flex items-center flex-wrap mt-2 sm:mt-4 text-xs sm:text-sm text-gray-500">

          <Link
            to="/cart"
            className="flex items-center gap-2 hover:text-black"
          >
            <FaShoppingCart />
            Cart
          </Link>

          <FaChevronRight className="mx-3 text-xs" />

          <span className="font-semibold text-indigo-600">
            Checkout
          </span>

          <FaChevronRight className="mx-3 text-xs" />

          <span className="flex items-center gap-2">
            <FaCreditCard />
            Payment
          </span>

        </div>

      </div>
    </div>
  );
}