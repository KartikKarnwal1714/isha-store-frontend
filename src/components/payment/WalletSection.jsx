import {
  FaWallet,
  FaCheckCircle,
  FaGift,
} from "react-icons/fa";

export default function WalletSection({
  selectedPayment,
  setSelectedPayment,
}) {
  const wallets = [
    {
      id: "amazonpay",
      name: "Amazon Pay",
      logo: "🟠",
      cashback: "5% Cashback",
    },
    {
      id: "paytm",
      name: "Paytm Wallet",
      logo: "💙",
      cashback: "₹50 Cashback",
    },
    {
      id: "phonepe",
      name: "PhonePe Wallet",
      logo: "💜",
      cashback: "Instant Payment",
    },
    {
      id: "mobikwik",
      name: "MobiKwik",
      logo: "🔵",
      cashback: "SuperCash Available",
    },
    {
      id: "freecharge",
      name: "Freecharge",
      logo: "🟢",
      cashback: "Offers Available",
    },
    {
      id: "giftcard",
      name: "Gift Card",
      logo: "🎁",
      cashback: "Redeem Balance",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold">
          Wallets & Gift Cards
        </h2>

        <p className="text-gray-500 mt-2">
          Choose your preferred wallet to complete the payment.
        </p>

      </div>

      {/* Wallet List */}

      <div className="grid md:grid-cols-2 gap-4">

        {wallets.map((wallet) => (

          <button
            key={wallet.id}
            type="button"
            onClick={() =>
              setSelectedPayment(wallet.id)
            }
            className={`border-2 rounded-2xl p-5 transition-all hover:shadow-md ${
              selectedPayment === wallet.id
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200"
            }`}
          >

            <div className="flex items-center">

              <div className="text-4xl">

                {wallet.logo}

              </div>

              <div className="ml-4 text-left">

                <h3 className="font-bold text-lg">
                  {wallet.name}
                </h3>

                <p className="text-sm text-green-600 font-medium">
                  {wallet.cashback}
                </p>

              </div>

              <div className="ml-auto">

                {selectedPayment === wallet.id && (
                  <FaCheckCircle className="text-green-600 text-2xl" />
                )}

              </div>

            </div>

          </button>

        ))}

      </div>

      {/* Wallet Benefits */}

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex gap-4">

        <FaGift className="text-yellow-500 text-2xl mt-1" />

        <div>

          <h4 className="font-bold text-yellow-700">
            Wallet Offers
          </h4>

          <p className="text-sm text-gray-600 mt-1">
            Cashback and rewards are subject to wallet provider terms and may vary by offer.
          </p>

        </div>

      </div>

      {/* Security */}

      <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-4">

        <FaWallet className="text-blue-600 text-2xl mt-1" />

        <div>

          <h4 className="font-bold text-blue-700">
            Safe & Secure
          </h4>

          <p className="text-sm text-gray-600 mt-1">
            Your wallet payment is processed through a secure payment gateway with encrypted authentication.
          </p>

        </div>

      </div>

    </div>
  );
}