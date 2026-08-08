import {
  FaLock,
  FaShieldAlt,
  FaUndo,
  FaHeadset,
  FaCheckCircle,
  FaTruck,
} from "react-icons/fa";

export default function SecurityInfo() {
  const features = [
    {
      icon: <FaLock className="text-green-600 text-3xl" />,
      title: "256-bit SSL Encryption",
      description:
        "Your payment information is encrypted using industry-standard SSL technology.",
    },
    {
      icon: <FaShieldAlt className="text-blue-600 text-3xl" />,
      title: "PCI DSS Compliant",
      description:
        "All card transactions are processed securely through certified payment gateways.",
    },
    {
      icon: <FaUndo className="text-orange-500 text-3xl" />,
      title: "Easy Refund Policy",
      description:
        "Eligible refunds are processed quickly to your original payment method.",
    },
    {
      icon: <FaTruck className="text-purple-600 text-3xl" />,
      title: "Safe Delivery",
      description:
        "Orders are securely packed and delivered through trusted courier partners.",
    },
    {
      icon: <FaHeadset className="text-pink-600 text-3xl" />,
      title: "24×7 Customer Support",
      description:
        "Our support team is available anytime to help with your order or payment.",
    },
    {
      icon: <FaCheckCircle className="text-emerald-600 text-3xl" />,
      title: "Trusted Checkout",
      description:
        "Thousands of customers shop safely with our secure payment infrastructure.",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">

      {/* Header */}

      <div className="text-center mb-10">

        <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 flex items-center justify-center">

          <FaShieldAlt className="text-indigo-600 text-4xl" />

        </div>

        <h2 className="text-3xl font-bold mt-5">

          Shop With Confidence

        </h2>

        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">

          Every payment is protected using advanced encryption and trusted payment infrastructure.

        </p>

      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {features.map((feature, index) => (

          <div
            key={index}
            className="border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >

            <div className="mb-5">

              {feature.icon}

            </div>

            <h3 className="font-bold text-lg">

              {feature.title}

            </h3>

            <p className="text-gray-500 text-sm mt-3 leading-7">

              {feature.description}

            </p>

          </div>

        ))}

      </div>

      {/* Bottom Banner */}

      <div className="mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl text-white p-8 text-center">

        <FaLock className="text-5xl mx-auto mb-5" />

        <h3 className="text-2xl font-bold">

          Secure Checkout Guaranteed

        </h3>

        <p className="mt-3 text-indigo-100 max-w-3xl mx-auto leading-7">

          Your personal information is never shared with third parties.
          All payments are securely processed through encrypted gateways,
          ensuring complete protection of your financial data.

        </p>

      </div>

    </div>
  );
}