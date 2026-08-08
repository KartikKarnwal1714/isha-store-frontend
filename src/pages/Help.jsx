import { Link } from "react-router-dom";

export default function Help() {
  return (
    <div className="min-h-screen bg-[#fff7ed] p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow p-8">
        <h1 className="text-4xl font-black mb-6">Help Center</h1>
        <div className="space-y-4 text-lg text-[#1f2937]">
          <p>For order, payment, return, exchange, or delivery help, contact ISHA STORE support.</p>
          <p><b>Support Time:</b> 10 AM to 7 PM</p>
          <p><b>Email:</b> support@ishastore.com</p>
        </div>

        <Link to="/" className="inline-block mt-8 bg-[#7c3aed] text-white px-6 py-3 rounded-full">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
