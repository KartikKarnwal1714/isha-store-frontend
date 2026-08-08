import { useState } from "react";
import {
  FaGooglePay,
  FaMobileAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function UPISection({
  selectedPayment,
  setSelectedPayment,
}) {
  const [upiId, setUpiId] = useState("");

  const upiApps = [
    {
      id: "gpay",
      name: "Google Pay",
      icon: <FaGooglePay className="text-3xl text-blue-600" />,
      recommended: true,
    },
    {
      id: "phonepe",
      name: "PhonePe",
      logo: "💜",
      recommended: true,
    },
    {
      id: "paytm",
      name: "Paytm",
      logo: "💙",
      recommended: false,
    },
    {
      id: "bhim",
      name: "BHIM UPI",
      logo: "🇮🇳",
      recommended: false,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold">
          Pay using UPI
        </h2>

        <p className="text-gray-500 mt-2">
          Fast, secure and instant payment
        </p>

      </div>

      {/* UPI Apps */}

      <div className="grid md:grid-cols-2 gap-4">

        {upiApps.map((app) => (

          <button
            key={app.id}
            type="button"
            onClick={() => setSelectedPayment(app.id)}
            className={`relative border-2 rounded-2xl p-5 transition-all duration-200 hover:shadow-md ${
              selectedPayment === app.id
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-300"
            }`}
          >

            {app.recommended && (
              <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                Recommended
              </span>
            )}

            <div className="flex items-center gap-4">

              <div className="text-4xl">
                {app.icon ? app.icon : app.logo}
              </div>

              <div className="text-left">

                <h3 className="font-bold text-lg">
                  {app.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Pay instantly
                </p>

              </div>

              <div className="ml-auto">

                {selectedPayment === app.id && (
                  <FaCheckCircle className="text-green-600 text-2xl" />
                )}

              </div>

            </div>

          </button>

        ))}

      </div>

      {/* Divider */}

      <div className="my-8 flex items-center">

        <div className="flex-1 h-px bg-gray-300" />

        <span className="px-4 text-gray-400 font-medium">
          OR
        </span>

        <div className="flex-1 h-px bg-gray-300" />

      </div>

      {/* UPI ID */}

      <div>

        <label className="block font-semibold mb-3">
          Enter UPI ID
        </label>

        <div className="flex">

          <div className="bg-gray-100 px-4 flex items-center rounded-l-xl border border-r-0">
            <FaMobileAlt className="text-indigo-600" />
          </div>

          <input
            type="text"
            placeholder="example@upi"
            value={upiId}
            onChange={(e) => {
              setUpiId(e.target.value);
              setSelectedPayment("upiId");
            }}
            className="flex-1 border rounded-r-xl px-4 py-4 outline-none focus:border-indigo-600"
          />

        </div>

        <p className="text-sm text-gray-500 mt-3">
          Example: 9876543210@upi
        </p>

      </div>

    </div>
  );
}