import PaymentHeader from "../components/payment/PaymentHeader";
import PaymentMethods from "../components/payment/PaymentMethods";
import PaymentSummary from "../components/payment/PaymentSummary";

export default function Payment() {
  return (
    <div className="min-h-screen bg-gray-100">

      <PaymentHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}

          <div className="lg:col-span-2">

            <PaymentMethods />

          </div>

          {/* RIGHT */}

          <div>

            <PaymentSummary />

          </div>

        </div>

      </div>

    </div>
  );
}