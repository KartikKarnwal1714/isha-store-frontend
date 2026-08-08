import { useEffect, useState } from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  useEffect(() => {
    const savedCustomer = JSON.parse(localStorage.getItem("customer")) || {};
    const savedProfile = JSON.parse(localStorage.getItem("customerProfile")) || {};

    setProfile({
      name: savedProfile.name || savedCustomer.name || "",
      phone: savedProfile.phone || savedCustomer.phone || "",
      email: savedProfile.email || savedCustomer.email || "",
      address: savedProfile.address || savedCustomer.address || "",
      city: savedProfile.city || "",
      state: savedProfile.state || "",
      pincode: savedProfile.pincode || "",
      landmark: savedProfile.landmark || "",
    });
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!profile.name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!profile.phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    if (!profile.address.trim()) {
      alert("Please enter your address");
      return;
    }

    localStorage.setItem("customerProfile", JSON.stringify(profile));
    localStorage.setItem("customer", JSON.stringify(profile));

    setIsEditing(false);
    alert("Profile saved successfully");
  };

  const handleCancel = () => {
    const savedProfile = JSON.parse(localStorage.getItem("customerProfile")) || profile;
    setProfile(savedProfile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#fff7ed] px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-[35px] border border-orange-100 shadow-xl overflow-hidden">

        <div className="bg-[#7c3aed] text-white px-10 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black">My Profile</h1>
            <p className="text-gray-300 mt-2">
              Manage your personal details and saved delivery address
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-3 bg-white text-[#1f2937] px-7 py-3 rounded-full font-bold hover:bg-[#ffedd5] transition"
            >
              <FaEdit />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition"
              >
                <FaSave />
                Save
              </button>

              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition"
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="p-10 grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1 bg-[#fff7ed] rounded-[30px] p-8 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-6xl shadow-lg">
              <FaUser />
            </div>

            <h2 className="text-2xl font-black mt-6">
              {profile.name || "Customer"}
            </h2>

            <p className="text-gray-500 mt-1">
              ISHA STORE Member
            </p>

            <div className="w-full mt-8 bg-white rounded-2xl border border-orange-100 p-5 border">
              <p className="text-sm text-gray-500">Saved Phone</p>
              <p className="font-bold mt-1">
                {profile.phone || "Not Added"}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">

            <div className="border rounded-[30px] p-7">
              <h3 className="text-2xl font-black mb-6">
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-5">
                <InputBox
                  icon={<FaUser />}
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <InputBox
                  icon={<FaPhone />}
                  label="Phone Number"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <InputBox
                  icon={<FaEnvelope />}
                  label="Email Address"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="border rounded-[30px] p-7">
              <h3 className="text-2xl font-black mb-2">
                Saved Delivery Address
              </h3>

              <p className="text-gray-500 mb-6">
                This address can be used later during checkout and order delivery.
              </p>

              <div className="grid md:grid-cols-2 gap-5">
                <InputBox
                  icon={<FaMapMarkerAlt />}
                  label="House / Street / Area"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <InputBox
                  label="Landmark"
                  name="landmark"
                  value={profile.landmark}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <InputBox
                  label="City"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <InputBox
                  label="State"
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <InputBox
                  label="Pincode"
                  name="pincode"
                  value={profile.pincode}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {!isEditing && (
                <div className="mt-8 bg-[#fff7ed] border rounded-2xl p-5">
                  <p className="text-sm text-gray-500 mb-2">
                    Complete Address Preview
                  </p>

                  <p className="font-semibold leading-7">
                    {profile.address || "No address saved"}
                    {profile.landmark && `, ${profile.landmark}`}
                    {profile.city && `, ${profile.city}`}
                    {profile.state && `, ${profile.state}`}
                    {profile.pincode && ` - ${profile.pincode}`}
                  </p>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function InputBox({ icon, label, name, value, onChange, disabled }) {
  return (
    <div>
      <label className="text-sm text-gray-500 font-medium">
        {label}
      </label>

      <div
        className={`mt-2 flex items-center gap-3 border rounded-2xl px-4 py-3 ${
          disabled ? "bg-[#fff7ed]" : "bg-white"
        }`}
      >
        {icon && <span className="text-gray-500">{icon}</span>}

        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full outline-none bg-transparent font-semibold"
          placeholder={`Enter ${label}`}
        />
      </div>
    </div>
  );
}