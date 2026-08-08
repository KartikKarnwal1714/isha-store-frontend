import {
  FaCheckCircle,
  FaShoppingBag,
  FaClipboardList,
  FaHome,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../CartContext";
import { useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const { clearCheckout } = useCart();

const location = useLocation();

const order = location.state?.order;

 const orderId = order?._id || "N/A";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">

      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-10 text-center">

        <div className="w-28 h-28 rounded-full bg-green-100 mx-auto flex items-center justify-center">

          <FaCheckCircle className="text-6xl text-green-600" />

        </div>

        <h1 className="text-4xl font-black mt-8 text-gray-900">
          Payment Successful
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Thank you for shopping with us.
          <br />
          Your order has been placed successfully.
        </p>

        <div className="mt-10 bg-gray-50 rounded-2xl border p-6">

          <div className="flex justify-between mb-4">

            <span className="font-semibold">
              Order ID
            </span>

            <span className="font-bold">
              {orderId}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="font-semibold">
              Amount Paid
            </span>

            <span className="text-2xl font-black text-indigo-600">
              ₹{order?.total}
            </span>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-10">

          <Link
            to="/current-orders"
            onClick={clearCheckout}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-3 transition"
          >
            <FaClipboardList />
            View My Orders
          </Link>

          <Link
            to="/"
            onClick={clearCheckout}
            className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-4 rounded-2xl font-bold flex justify-center items-center gap-3 transition"
          >
            <FaShoppingBag />
            Continue Shopping
          </Link>

        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 text-gray-500 hover:text-indigo-600"
        >
          <FaHome />
          Back to Home
        </Link>

      </div>

    </div>
  );
}