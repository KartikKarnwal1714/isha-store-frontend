import {
  FaUniversity,
  FaCheckCircle,
  FaSearch,
} from "react-icons/fa";
import { useState } from "react";

export default function NetBankingSection({
  selectedPayment,
  setSelectedPayment,
}) {
  const [search, setSearch] = useState("");

  const banks = [
    {
      id: "sbi",
      name: "State Bank of India",
      short: "SBI",
    },
    {
      id: "hdfc",
      name: "HDFC Bank",
      short: "HDFC",
    },
    {
      id: "icici",
      name: "ICICI Bank",
      short: "ICICI",
    },
    {
      id: "axis",
      name: "Axis Bank",
      short: "AXIS",
    },
    {
      id: "kotak",
      name: "Kotak Mahindra Bank",
      short: "KOTAK",
    },
    {
      id: "pnb",
      name: "Punjab National Bank",
      short: "PNB",
    },
    {
      id: "bob",
      name: "Bank of Baroda",
      short: "BOB",
    },
    {
      id: "canara",
      name: "Canara Bank",
      short: "CANARA",
    },
  ];

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold">
          Net Banking
        </h2>

        <p className="text-gray-500 mt-2">
          Choose your bank and continue securely.
        </p>

      </div>

      {/* Search */}

      <div className="relative mb-6">

        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          placeholder="Search your bank..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-xl pl-12 pr-4 py-4 outline-none focus:border-indigo-600"
        />

      </div>

      {/* Banks */}

      <div className="grid md:grid-cols-2 gap-4">

        {filteredBanks.map((bank) => (

          <button
            key={bank.id}
            type="button"
            onClick={() =>
              setSelectedPayment(bank.id)
            }
            className={`border-2 rounded-2xl p-5 transition hover:shadow-md ${
              selectedPayment === bank.id
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200"
            }`}
          >

            <div className="flex items-center">

              {/* Bank Icon */}

              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">

                {bank.short}

              </div>

              <div className="ml-4 text-left">

                <h3 className="font-bold">
                  {bank.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Internet Banking
                </p>

              </div>

              <div className="ml-auto">

                {selectedPayment === bank.id && (
                  <FaCheckCircle className="text-green-600 text-2xl" />
                )}

              </div>

            </div>

          </button>

        ))}

      </div>

      {/* Security */}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-4">

        <FaUniversity className="text-blue-600 text-2xl mt-1" />

        <div>

          <h4 className="font-bold text-blue-700">
            Secure Bank Authentication
          </h4>

          <p className="text-sm text-gray-600 mt-1">
            You'll be redirected to your bank's secure login page to complete your payment.
          </p>

        </div>

      </div>

    </div>
  );
}