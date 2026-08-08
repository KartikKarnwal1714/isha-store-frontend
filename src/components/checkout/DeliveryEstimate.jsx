import {
  FaTruck,
  FaBoxOpen,
  FaUndoAlt,
  FaBolt,
} from "react-icons/fa";

export default function DeliveryEstimate() {
  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 rounded-3xl p-6 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl shadow-lg">
          <FaTruck />
        </div>

        <div className="flex-1">

          <h2 className="text-2xl font-bold text-gray-900">
            Estimated Delivery
          </h2>

          <p className="text-gray-600 mt-1">
            Your order is expected to arrive between
          </p>

          <p className="text-xl font-bold text-indigo-700 mt-2">
            28 July – 30 July
          </p>

        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-8">

        <div className="bg-white rounded-2xl p-5 shadow-sm border">

          <FaBolt className="text-yellow-500 text-2xl mb-3" />

          <h3 className="font-bold">
            Express Delivery
          </h3>

          <p className="text-gray-500 text-sm mt-2">
            Get it as early as tomorrow.
          </p>

        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border">

          <FaBoxOpen className="text-green-600 text-2xl mb-3" />

          <h3 className="font-bold">
            Free Shipping
          </h3>

          <p className="text-gray-500 text-sm mt-2">
            No delivery charge on eligible orders.
          </p>

        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border">

          <FaUndoAlt className="text-red-500 text-2xl mb-3" />

          <h3 className="font-bold">
            Easy Returns
          </h3>

          <p className="text-gray-500 text-sm mt-2">
            Return within 10 days after delivery.
          </p>

        </div>

      </div>

    </div>
  );
}