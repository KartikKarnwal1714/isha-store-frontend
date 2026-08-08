import {
  FaMoneyBillWave,
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

export default function CODSection({
  selectedPayment,
  setSelectedPayment,
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold">
          Cash on Delivery
        </h2>

        <p className="text-gray-500 mt-2">
          Pay when your order is delivered.
        </p>

      </div>

      {/* COD Option */}

      <button
        type="button"
        onClick={() => setSelectedPayment("cod")}
        className={`w-full border-2 rounded-2xl p-6 transition-all ${
          selectedPayment === "cod"
            ? "border-indigo-600 bg-indigo-50"
            : "border-gray-200 hover:border-indigo-300"
        }`}
      >

        <div className="flex items-center">

          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">

            <FaMoneyBillWave className="text-3xl text-green-600" />

          </div>

          <div className="ml-5 text-left">

            <h3 className="text-xl font-bold">
              Cash on Delivery
            </h3>

            <p className="text-gray-500 mt-1">
              Pay by cash when your order arrives.
            </p>

          </div>

          <div className="ml-auto">

            {selectedPayment === "cod" && (
              <FaCheckCircle className="text-green-600 text-3xl" />
            )}

          </div>

        </div>

      </button>

      {/* Delivery Info */}

      <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-5 flex gap-4">

        <FaTruck className="text-green-600 text-2xl mt-1" />

        <div>

          <h4 className="font-bold text-green-700">
            Delivery Information
          </h4>

          <p className="text-sm text-gray-600 mt-2">
            Cash on Delivery is available for eligible locations only.
            Our delivery partner will collect the payment when the order is delivered.
          </p>

        </div>

      </div>

      {/* COD Charge */}

      <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex justify-between items-center">

        <div className="flex gap-4">

          <FaExclamationTriangle className="text-yellow-600 text-2xl mt-1" />

          <div>

            <h4 className="font-bold text-yellow-700">
              Cash Handling Charge
            </h4>

            <p className="text-sm text-gray-600 mt-1">
              Some orders may include a small COD handling fee.
            </p>

          </div>

        </div>

        <span className="font-bold text-lg">
          ₹0
        </span>

      </div>

      {/* Important Note */}

      <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-4">

        <FaInfoCircle className="text-blue-600 text-2xl mt-1" />

        <div>

          <h4 className="font-bold text-blue-700">
            Important
          </h4>

          <ul className="text-sm text-gray-600 mt-2 space-y-2 list-disc list-inside">

            <li>
              Keep the exact payment amount ready.
            </li>

            <li>
              Please verify the package before accepting it if allowed by the seller.
            </li>

            <li>
              A valid OTP or signature may be required at delivery.
            </li>

            <li>
              COD availability depends on your delivery address.
            </li>

          </ul>

        </div>

      </div>

      {/* Terms */}

      <div className="mt-6 p-4 rounded-xl bg-gray-50 border">

        <p className="text-sm text-gray-500 leading-7">
          By choosing Cash on Delivery, you agree to make the payment
          at the time of delivery. Failure to accept the shipment may
          affect the availability of Cash on Delivery for future orders.
        </p>

      </div>

    </div>
  );
}