import CheckoutHeader from "../components/checkout/CheckoutHeader";
import DeliverySection from "../components/checkout/DeliverySection";
import CartItemsSection from "../components/checkout/CartItemsSection";
import PriceSummary from "../components/checkout/PriceSummary";
import CheckoutStepper from "../components/checkout/CheckoutStepper";
import DeliveryEstimate from "../components/checkout/DeliveryEstimate";
import TrustBadges from "../components/checkout/TrustBadges";
import OrderNotes from "../components/checkout/OrderNotes";


export default function Checkout() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar (temporary) */}
      <CheckoutHeader />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-8">

             <CheckoutStepper />

        </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">

          {/* LEFT SIDE */}

          <div className="lg:col-span-2 space-y-4 sm:space-y-8">

            <DeliverySection />

            <DeliveryEstimate />

            <CartItemsSection />

            <TrustBadges />

            <OrderNotes />


          </div>

          {/* RIGHT SIDE */}

          <div>

            <PriceSummary />

          </div>

        </div>

      </div>

    </div>
  );
}