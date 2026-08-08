import {
  FaShoppingCart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";

export default function CheckoutStepper() {
  const steps = [
    {
      id: 1,
      title: "Cart",
      icon: <FaShoppingCart />,
      status: "completed",
    },
    {
      id: 2,
      title: "Checkout",
      icon: <FaMapMarkerAlt />,
      status: "active",
    },
    {
      id: 3,
      title: "Payment",
      icon: <FaCreditCard />,
      status: "upcoming",
    },
    {
      id: 4,
      title: "Success",
      icon: <FaCheckCircle />,
      status: "upcoming",
    },
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200 p-3 sm:p-8">

      <div className="flex items-center justify-between relative">

        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex-1 flex flex-col items-center relative"
          >

            {/* Line */}

            {index !== steps.length - 1 && (
              <div
                className={`absolute top-4 sm:top-6 left-1/2 w-full h-0.5 sm:h-1 ${
                  step.status === "completed"
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            )}

            {/* Circle */}

            <div
              className={`relative z-10 w-8 h-8 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xs sm:text-xl transition-all duration-300

                ${
                  step.status === "completed"
                    ? "bg-green-500 text-white shadow-lg"
                    : ""
                }

                ${
                  step.status === "active"
                    ? "bg-indigo-600 text-white ring-4 sm:ring-8 ring-indigo-100 scale-105 sm:scale-110"
                    : ""
                }

                ${
                  step.status === "upcoming"
                    ? "bg-gray-200 text-gray-500"
                    : ""
                }

              `}
            >
              {step.icon}
            </div>

            {/* Title */}

            <p
              className={`mt-1.5 sm:mt-4 text-[10px] sm:text-base font-semibold

                ${
                  step.status === "active"
                    ? "text-indigo-600"
                    : "text-gray-600"
                }

              `}
            >
              {step.title}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}