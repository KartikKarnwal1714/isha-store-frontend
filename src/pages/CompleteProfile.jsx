import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/client";

export default function CompleteProfile() {
  const navigate = useNavigate();

  const customer = JSON.parse(localStorage.getItem("customer")) || {};

  const [form, setForm] = useState({
    phone: customer.phone || "",
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await api.post(
        "/users/complete-profile",
        form
      );

      localStorage.setItem(
        "customer",
        JSON.stringify(res.data.user)
      );

      // Use the address they just entered as the delivery
      // location shown across the site, so they don't have
      // to enter it again on the homepage location bar.
      localStorage.setItem(
        "deliveryLocation",
        JSON.stringify({
          label: `${form.city}, ${form.state}`,
          pincode: form.pincode,
        })
      );

      alert("Profile completed successfully");

      navigate("/");
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Profile save failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7ed] px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-[35px] border border-orange-100 shadow-xl overflow-hidden">
        <div className="bg-[#7c3aed] text-white px-10 py-10">
          <h1 className="text-4xl font-black">
            Complete Your Profile
          </h1>
          <p className="text-gray-300 mt-2">
            Add your details once for faster checkout and delivery.
          </p>
        </div>

        <div className="p-10 grid md:grid-cols-2 gap-5">
          <Input
            label="Full Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            label="Phone Number *"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled
          />

          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="House / Street / Area *"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <Input
            label="City *"
            name="city"
            value={form.city}
            onChange={handleChange}
          />

          <Input
            label="State *"
            name="state"
            value={form.state}
            onChange={handleChange}
          />

          <Input
            label="Pincode *"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
          />

          <Input
            label="Landmark"
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
          />

          <button
            onClick={handleSave}
            className="md:col-span-2 bg-[#7c3aed] text-white py-4 rounded-2xl font-bold hover:bg-[#1e1b4b] transition mt-5"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, disabled }) {
  return (
    <div>
      <label className="text-sm text-gray-500 font-semibold">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full border px-5 py-4 rounded-2xl mt-2 outline-none disabled:bg-[#fff7ed]"
      />
    </div>
  );
}