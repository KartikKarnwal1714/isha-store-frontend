import { FaRegStickyNote, FaGift, FaBell } from "react-icons/fa";

export default function OrderNotes() {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
          <FaRegStickyNote className="text-indigo-600 text-xl" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Delivery Preferences
          </h2>

          <p className="text-gray-500">
            Add special instructions for your order.
          </p>
        </div>

      </div>

      <div className="space-y-6">

        <div>

          <label className="block font-semibold mb-2">
            Delivery Instructions
          </label>

          <textarea
            rows="4"
            placeholder="Example: Leave the package with the security guard or call before delivery."
            className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />

        </div>

        <div>

          <label className="block font-semibold mb-2">
            Gift Message
          </label>

          <textarea
            rows="3"
            placeholder="Write a personalized message..."
            className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <label className="border rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-indigo-500 transition">

            <input type="checkbox" />

            <FaGift className="text-pink-500 text-xl" />

            <span>Gift Wrap this Order</span>

          </label>

          <label className="border rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-indigo-500 transition">

            <input type="checkbox" />

            <FaBell className="text-yellow-500 text-xl" />

            <span>Notify me before delivery</span>

          </label>

        </div>

      </div>

    </div>
  );
}