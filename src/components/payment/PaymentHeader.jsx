import {
  FaArrowLeft,
  FaLock,
  FaShoppingCart,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PaymentHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">

      {/* Top Header */}

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Left */}

        <div className="flex items-center gap-5">

          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-full border hover:bg-gray-100 transition flex items-center justify-center"
          >
            <FaArrowLeft size={18} />
          </button>

          <div>

            <h1 className="text-3xl font-black text-gray-900">
              Secure Payment
            </h1>

            <p className="text-gray-500 mt-1">
              Complete your purchase securely
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="hidden md:flex items-center gap-3 bg-green-50 border border-green-200 px-5 py-3 rounded-2xl">

          <FaLock className="text-green-600 text-xl" />

          <div>

            <h4 className="font-bold text-green-700">
              256-bit SSL Secure
            </h4>

            <p className="text-xs text-green-600">
              Encrypted Payment Gateway
            </p>

          </div>

        </div>

      </div>

      {/* Checkout Progress */}

      <div className="border-t bg-gray-50">

        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex items-center justify-center gap-8 flex-wrap">

            {/* Cart */}

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">

                <FaShoppingCart />

              </div>

              <div>

                <p className="text-xs text-gray-500">
                  Step 1
                </p>

                <p className="font-semibold">
                  Cart
                </p>

              </div>

            </div>

            <div className="w-16 h-1 rounded bg-green-500"></div>

            {/* Checkout */}

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">

                <FaCheckCircle />

              </div>

              <div>

                <p className="text-xs text-gray-500">
                  Step 2
                </p>

                <p className="font-semibold">
                  Checkout
                </p>

              </div>

            </div>

            <div className="w-16 h-1 rounded bg-indigo-600"></div>

            {/* Payment */}

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center animate-pulse">

                <FaCreditCard />

              </div>

              <div>

                <p className="text-xs text-indigo-600 font-semibold">
                  Step 3
                </p>

                <p className="font-bold text-indigo-700">
                  Payment
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}