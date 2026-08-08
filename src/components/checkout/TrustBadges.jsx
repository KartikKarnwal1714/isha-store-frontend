import {
  FaShieldAlt,
  FaUndo,
  FaTruck,
  FaMoneyBillWave,
} from "react-icons/fa";

const badges = [
  {
    icon: <FaShieldAlt className="text-3xl text-green-600" />,
    title: "100% Secure Payment",
    description: "Your payment is protected with bank-level encryption.",
  },
  {
    icon: <FaTruck className="text-3xl text-blue-600" />,
    title: "Fast Delivery",
    description: "Orders are dispatched within 24 hours.",
  },
  {
    icon: <FaUndo className="text-3xl text-orange-500" />,
    title: "Easy Returns",
    description: "Return eligible products within 10 days.",
  },
  {
    icon: <FaMoneyBillWave className="text-3xl text-purple-600" />,
    title: "Cash on Delivery",
    description: "Pay after receiving your order.",
  },
];

export default function TrustBadges() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">

      <h2 className="text-2xl font-bold mb-6">
        Why Shop With Us?
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        {badges.map((item, index) => (

          <div
            key={index}
            className="flex gap-4 p-5 rounded-2xl border hover:shadow-lg transition duration-300"
          >

            <div>{item.icon}</div>

            <div>

              <h3 className="font-bold text-lg">

                {item.title}

              </h3>

              <p className="text-gray-500 text-sm mt-2">

                {item.description}

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}