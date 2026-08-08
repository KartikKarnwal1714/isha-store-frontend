import { useState } from "react";
import {
  FaCreditCard,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";

export default function CardSection({
  selectedPayment,
  setSelectedPayment,
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, "").slice(0, 16);
    return numbers.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold">
          Credit / Debit Card
        </h2>

        <p className="text-gray-500 mt-2">
          Pay securely using your card.
        </p>

      </div>

      {/* Saved Card */}

      <button
        type="button"
        onClick={() => setSelectedPayment("saved-card")}
        className={`w-full border-2 rounded-2xl p-5 mb-6 transition ${
          selectedPayment === "saved-card"
            ? "border-indigo-600 bg-indigo-50"
            : "border-gray-200"
        }`}
      >

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-4">

            <FaCreditCard className="text-3xl text-indigo-600" />

            <div className="text-left">

              <h3 className="font-bold">
                Visa ending in 4821
              </h3>

              <p className="text-gray-500 text-sm">
                Expires 08/29
              </p>

            </div>

          </div>

          {selectedPayment === "saved-card" && (
            <FaCheckCircle className="text-green-600 text-2xl" />
          )}

        </div>

      </button>

      {/* Divider */}

      <div className="flex items-center my-8">

        <div className="flex-1 h-px bg-gray-300"></div>

        <span className="px-4 text-gray-400 font-semibold">
          OR PAY WITH NEW CARD
        </span>

        <div className="flex-1 h-px bg-gray-300"></div>

      </div>

      {/* Card Number */}

      <div className="mb-5">

        <label className="block font-semibold mb-2">
          Card Number
        </label>

        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => {
            setCardNumber(formatCardNumber(e.target.value));
            setSelectedPayment("new-card");
          }}
          className="w-full border rounded-xl px-4 py-4 outline-none focus:border-indigo-600"
        />

      </div>

      {/* Card Holder */}

      <div className="mb-5">

        <label className="block font-semibold mb-2">
          Card Holder Name
        </label>

        <input
          type="text"
          placeholder="Name on Card"
          value={cardName}
          onChange={(e) => {
            setCardName(e.target.value);
            setSelectedPayment("new-card");
          }}
          className="w-full border rounded-xl px-4 py-4 outline-none focus:border-indigo-600"
        />

      </div>

      {/* Expiry + CVV */}

      <div className="grid grid-cols-2 gap-4 mb-5">

        <div>

          <label className="block font-semibold mb-2">
            Expiry
          </label>

          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => {
              setExpiry(e.target.value);
              setSelectedPayment("new-card");
            }}
            className="w-full border rounded-xl px-4 py-4 outline-none focus:border-indigo-600"
          />

        </div>

        <div>

          <label className="block font-semibold mb-2">
            CVV
          </label>

          <input
            type="password"
            maxLength={3}
            placeholder="***"
            value={cvv}
            onChange={(e) => {
              setCvv(e.target.value);
              setSelectedPayment("new-card");
            }}
            className="w-full border rounded-xl px-4 py-4 outline-none focus:border-indigo-600"
          />

        </div>

      </div>

      {/* Save Card */}

      <label className="flex items-center gap-3 mb-6">

        <input
          type="checkbox"
          checked={saveCard}
          onChange={() => setSaveCard(!saveCard)}
          className="w-5 h-5"
        />

        <span className="font-medium">
          Save this card for future payments
        </span>

      </label>

      {/* Security */}

      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3">

        <FaLock className="text-green-600 mt-1" />

        <div>

          <h4 className="font-bold text-green-700">
            Secure Payment
          </h4>

          <p className="text-sm text-gray-600">
            Your card details are encrypted and never stored on our servers.
          </p>

        </div>

      </div>

    </div>
  );
}