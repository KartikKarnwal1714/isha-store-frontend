import {
  FaArrowRight,
  FaLock,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useCart } from "../../CartContext";
import { useAuth } from "../../api/AuthContext";
import api from "../../api/client";
import { useState } from "react";

export default function PaymentSummary() {
  const loadRazorpay = () => {

  return new Promise((resolve) => {

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";


    script.onload = () => {

      resolve(true);

    };


    script.onerror = () => {

      resolve(false);

    };


    document.body.appendChild(script);

  });

};

  const navigate = useNavigate();

  const { customer } = useAuth();

const [loading, setLoading] = useState(false);

const {
  cartItems,
  subtotal,
  shipping,
  tax,
  discount,
  grandTotal,
  selectedAddress,
  paymentMethod,
  clearCheckout,
} = useCart();

  const paymentName = {
    gpay: "Google Pay",
    phonepe: "PhonePe",
    paytm: "Paytm",
    bhim: "BHIM UPI",
    upiId: "UPI ID",
    "saved-card": "Saved Card",
    "new-card": "Credit / Debit Card",
    sbi: "State Bank of India",
    hdfc: "HDFC Bank",
    icici: "ICICI Bank",
    axis: "Axis Bank",
    kotak: "Kotak Bank",
    pnb: "Punjab National Bank",
    bob: "Bank of Baroda",
    canara: "Canara Bank",
    amazonpay: "Amazon Pay",
    mobikwik: "MobiKwik",
    freecharge: "Freecharge",
    giftcard: "Gift Card",
    cod: "Cash on Delivery",
  };

  const placeOrder = async () => {
  try {
    if (!customer) {
      alert("Please login first.");
      return;
    }

    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    const orderData = {
      customerId: customer._id,

      customerName: customer.name,

      customerPhone: customer.phone,

      email: customer.email || "",

      phone: customer.phone || "",

      address: {
        house: selectedAddress.house || "",
        city: selectedAddress.city || "",
        state: selectedAddress.state || "",
        pincode: selectedAddress.pincode || "",
        landmark: selectedAddress.landmark || "",
      },

      products: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        originalPrice: item.originalPrice || item.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
      })),

      subtotal,

      shipping,

      tax,

      discount,

      total: grandTotal,

      paymentMethod:
        paymentMethod === "cod"
          ? "COD"
          : "Online",

      paymentStatus:
        paymentMethod === "cod"
          ? "Pending"
          : "Paid",
    };

    const response = await api.post(
      "/orders/create",
      orderData
    );

    if (response.data.success) {
      clearCheckout();

      navigate("/payment-success", {
        state: {
          order: response.data.order,
        },
      });
    }
  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
        "Order could not be placed."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="sticky top-24">

      <div className="bg-white rounded-3xl shadow-lg border overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">

          <h2 className="text-2xl font-bold">

            Payment Summary

          </h2>

          <p className="text-indigo-100 mt-2">

            Review before payment

          </p>

        </div>

        <div className="p-6">

          {/* Items */}

          <div className="flex justify-between mb-3">

            <span>
              Items
            </span>

            <span>
              {cartItems.length}
            </span>

          </div>

          <div className="flex justify-between mb-3">

            <span>
              Subtotal
            </span>

            <span>
              ₹{subtotal}
            </span>

          </div>

          <div className="flex justify-between mb-3">

            <span>
              Shipping
            </span>

            <span className="text-green-600">

              {shipping === 0
                ? "FREE"
                : `₹${shipping}`}

            </span>

          </div>

          <div className="flex justify-between mb-3">

            <span>
              GST
            </span>

            <span>
              ₹{tax}
            </span>

          </div>

          <div className="flex justify-between text-green-600 mb-3">

            <span>
              Discount
            </span>

            <span>

              -₹{discount}

            </span>

          </div>

          <hr className="my-5" />

          <div className="flex justify-between items-center">

            <span className="text-xl font-bold">

              Total

            </span>

            <span className="text-3xl font-black">

              ₹{grandTotal}

            </span>

          </div>

          {/* Address */}

          <div className="mt-8 border rounded-2xl p-4">

            <div className="flex items-center gap-2 mb-3">

              <FaMapMarkerAlt className="text-indigo-600" />

              <h3 className="font-bold">

                Deliver To

              </h3>

            </div>

            {selectedAddress ? (

              <div className="text-sm text-gray-600 leading-7">

                <p className="font-bold text-black">

                  {selectedAddress.fullName}

                </p>

                <p>

                  {selectedAddress.house}

                  {selectedAddress.area &&
                    `, ${selectedAddress.area}`}

                </p>

                <p>

                  {selectedAddress.city},{" "}
                  {selectedAddress.state}

                </p>

                <p>

                  {selectedAddress.pincode}

                </p>

              </div>

            ) : (

              <p className="text-red-500">

                No address selected

              </p>

            )}

          </div>

          {/* Payment */}

          <div className="mt-6 border rounded-2xl p-4">

            <div className="flex items-center gap-2 mb-3">

              <FaCreditCard className="text-indigo-600" />

              <h3 className="font-bold">

                Payment Method

              </h3>

            </div>

            <p className="font-semibold">

              {paymentName[paymentMethod] ||
                "Not Selected"}

            </p>

          </div>

          {/* Security */}

          <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3">

            <FaLock className="text-green-600 mt-1" />

            <div>

              <h4 className="font-bold text-green-700">

                100% Secure Payment

              </h4>

              <p className="text-sm text-gray-600">

                SSL Encrypted • PCI DSS Compliant

              </p>

            </div>

          </div>

          {/* Button */}

          <button
            disabled={
              !selectedAddress ||
              !paymentMethod ||
              cartItems.length === 0
            }
            className={`w-full mt-8 py-5 rounded-2xl font-bold text-lg flex justify-center items-center gap-3 transition ${
              !selectedAddress ||
              !paymentMethod ||
              cartItems.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            onClick={placeOrder}
          >

            {loading
              ? "Placing Order..."
              : `Pay ₹${grandTotal}`}

            <FaArrowRight />

          </button>

          <p className="text-center text-gray-400 text-sm mt-5">

            Razorpay integration will be connected here.

          </p>

        </div>

      </div>

    </div>

  );
}