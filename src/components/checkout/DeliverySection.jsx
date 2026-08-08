import {
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaCheckCircle,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useCart } from "../../CartContext";

export default function DeliverySection() {
  const { selectedAddress } = useCart();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold text-gray-900">
            Delivery Address
          </h2>

          <p className="text-gray-500 mt-1">
            Select where you want your order delivered.
          </p>

        </div>

        <Link
          to="/addresses"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl transition"
        >
          <FaPlus />

          {selectedAddress ? "Change" : "Add Address"}
        </Link>

      </div>

      {/* No Address */}

      {!selectedAddress && (

        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">

          <FaMapMarkerAlt className="text-5xl text-gray-300 mx-auto mb-5" />

          <h3 className="text-2xl font-bold">
            No Delivery Address Selected
          </h3>

          <p className="text-gray-500 mt-3">
            Please select an address before
            proceeding to payment.
          </p>

          <Link
            to="/addresses"
            className="inline-flex items-center gap-2 mt-8 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700"
          >
            <FaPlus />

            Add Address

          </Link>

        </div>

      )}

      {/* Selected Address */}

      {selectedAddress && (

        <div className="border-2 border-indigo-600 rounded-2xl p-5 bg-indigo-50">

          <div className="flex justify-between items-start">

            <div className="flex gap-4">

              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center">

                <FaMapMarkerAlt />

              </div>

              <div>

                <div className="flex items-center gap-3">

                  <h3 className="text-xl font-bold">

                    {selectedAddress.fullName}

                  </h3>

                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">

                    {selectedAddress.addressType}

                  </span>

                </div>

                <p className="text-gray-600 mt-3">

                  {selectedAddress.house}

                  {selectedAddress.area &&
                    `, ${selectedAddress.area}`}

                  {selectedAddress.landmark &&
                    `, ${selectedAddress.landmark}`}

                  <br />

                  {selectedAddress.city},

                  {" "}

                  {selectedAddress.state}

                  {" - "}

                  {selectedAddress.pincode}

                </p>

                <p className="mt-3 font-medium">

                  📞 {selectedAddress.phone}

                </p>

              </div>

            </div>

            <Link
              to="/addresses"
              className="flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-100 transition"
            >

              <FaEdit />

              Change

            </Link>

          </div>

          <div className="mt-5 flex items-center text-green-600 font-semibold gap-2">

            <FaCheckCircle />

            Deliver to this address

          </div>

        </div>

      )}

    </div>
  );
}