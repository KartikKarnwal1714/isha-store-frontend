import { useState } from "react";
import {
  FaMobileAlt,
  FaCreditCard,
  FaUniversity,
  FaWallet,
  FaMoneyBillWave,
} from "react-icons/fa";

import { useCart } from "../../CartContext";

import UPISection from "./UPISection";
import CardSection from "./CardSection";
import NetBankingSection from "./NetBankingSection";
import WalletSection from "./WalletSection";
import CODSection from "./CODSection";

export default function PaymentMethods() {
  const [activeMethod, setActiveMethod] =
    useState("upi");

  // Get payment method from CartContext
  const {
    paymentMethod,
    setPaymentMethod,
  } = useCart();

  const methods = [
    {
      id: "upi",
      title: "UPI",
      icon: <FaMobileAlt />,
    },
    {
      id: "card",
      title: "Credit / Debit Card",
      icon: <FaCreditCard />,
    },
    {
      id: "bank",
      title: "Net Banking",
      icon: <FaUniversity />,
    },
    {
      id: "wallet",
      title: "Wallet",
      icon: <FaWallet />,
    },
    {
      id: "cod",
      title: "Cash on Delivery",
      icon: <FaMoneyBillWave />,
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

      <div className="grid md:grid-cols-3">

        {/* LEFT MENU */}

        <div className="border-r bg-gray-50">

          {methods.map((method) => (

            <button
              key={method.id}
              onClick={() =>
                setActiveMethod(method.id)
              }
              className={`w-full flex items-center gap-4 px-6 py-5 text-left transition ${
                activeMethod === method.id
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">
                {method.icon}
              </span>

              <span className="font-semibold">
                {method.title}
              </span>

            </button>

          ))}

        </div>

        {/* RIGHT CONTENT */}

        <div className="md:col-span-2 p-8">

          {activeMethod === "upi" && (
            <UPISection
              selectedPayment={paymentMethod}
              setSelectedPayment={setPaymentMethod}
            />
          )}

          {activeMethod === "card" && (
            <CardSection
              selectedPayment={paymentMethod}
              setSelectedPayment={setPaymentMethod}
            />
          )}

          {activeMethod === "bank" && (
            <NetBankingSection
              selectedPayment={paymentMethod}
              setSelectedPayment={setPaymentMethod}
            />
          )}

          {activeMethod === "wallet" && (
            <WalletSection
              selectedPayment={paymentMethod}
              setSelectedPayment={setPaymentMethod}
            />
          )}

          {activeMethod === "cod" && (
            <CODSection
              selectedPayment={paymentMethod}
              setSelectedPayment={setPaymentMethod}
            />
          )}

        </div>

      </div>

    </div>
  );
}