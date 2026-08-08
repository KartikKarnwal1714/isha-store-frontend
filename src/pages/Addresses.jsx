import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../CartContext";

import {
  FaArrowLeft,
  FaCheck,
  FaEdit,
  FaHome,
  FaMapMarkerAlt,
  FaPlus,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import { API_URL } from "../utils/apiUrl";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  house: "",
  area: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  addressType: "Home",
  isDefault: false,
};

export default function Addresses() {
  const navigate = useNavigate();

  const { setSelectedAddress } = useCart();

  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [locating, setLocating] = useState(false);
  const [pincodeLookupLoading, setPincodeLookupLoading] = useState(false);

  const fetchAddresses = async (customerId) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/addresses/${customerId}`
      );

      setAddresses(
        Array.isArray(response.data?.addresses)
          ? response.data.addresses
          : []
      );
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Addresses could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let savedCustomer = null;

    try {
      savedCustomer = JSON.parse(
        localStorage.getItem("customer") || "null"
      );
    } catch (parseError) {
      console.error(parseError);
    }

    if (!savedCustomer?._id) {
      navigate("/login");
      return;
    }

    setCustomer(savedCustomer);
    fetchAddresses(savedCustomer._id);
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "pincode") {
      lookupPincode(value);
    }
  };

  // ======================================================
  // AUTO-FILL CITY / STATE FROM PINCODE
  // Routed through our own server (see routes/locationRoutes.js)
  // because the India Post pincode API does not support
  // being called directly from a browser (no CORS headers).
  // ======================================================
  const lookupPincode = async (pincode) => {
    const cleanPincode = pincode.trim();

    if (!/^\d{6}$/.test(cleanPincode)) {
      return;
    }

    try {
      setPincodeLookupLoading(true);

      const response = await axios.get(
        `${API_URL}/location/pincode/${cleanPincode}`
      );

      if (response.data?.success) {
        setForm((current) => ({
          ...current,
          city: response.data.city || current.city,
          state: response.data.state || current.state,
          country: response.data.country || current.country,
        }));
      }
    } catch (lookupError) {
      console.error("Pincode lookup error:", lookupError);
    } finally {
      setPincodeLookupLoading(false);
    }
  };

  // ======================================================
  // AUTO-DETECT ADDRESS FROM CURRENT GPS LOCATION
  // Routed through our own server (see routes/locationRoutes.js)
  // because Nominatim requires a real User-Agent header,
  // which browsers do not let JavaScript set, and it also
  // blocks a lot of generic direct-from-browser requests.
  // ======================================================
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Location detection is not supported on this device.");
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await axios.get(
            `${API_URL}/location/reverse`,
            {
              params: {
                lat: latitude,
                lon: longitude,
              },
            }
          );

          if (!response.data?.success) {
            throw new Error("Reverse geocoding failed");
          }

          const detected = response.data;

          setForm((current) => ({
            ...current,
            area: detected.area || current.area,
            landmark: detected.landmark || current.landmark,
            city: detected.city || current.city,
            state: detected.state || current.state,
            pincode: detected.pincode || current.pincode,
            country: detected.country || current.country,
          }));

          if (detected.pincode) {
            lookupPincode(detected.pincode);
          }

          setSuccess(
            "Location detected. Please check the details below before saving."
          );
        } catch (lookupError) {
          console.error("Reverse geocoding error:", lookupError);

          setError(
            "Could not detect your address. Please enter it manually."
          );
        } finally {
          setLocating(false);
        }
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);

        setError(
          "Location permission was denied. Please enter your address manually."
        );

        setLocating(false);
      }
    );
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      return "Enter full name";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      return "Enter a valid 10-digit phone number";
    }

    if (!form.house.trim()) {
      return "Enter house or flat number";
    }

    if (!form.city.trim()) {
      return "Enter city";
    }

    if (!form.state.trim()) {
      return "Enter state";
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      return "Enter a valid 6-digit pincode";
    }

    return "";
  };

  const saveAddress = async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        house: form.house.trim(),
        area: form.area.trim(),
        landmark: form.landmark.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      };

      const response = editingId
        ? await axios.put(
            `${API_URL}/addresses/${customer._id}/${editingId}`,
            payload
          )
        : await axios.post(
            `${API_URL}/addresses/${customer._id}`,
            payload
          );

      setAddresses(response.data.addresses || []);
      setSuccess(response.data.message);
      resetForm();
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Address could not be saved."
      );
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (address) => {
    setEditingId(address._id);

    setForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      house: address.house || "",
      area: address.area || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
      addressType: address.addressType || "Home",
      isDefault: Boolean(address.isDefault),
    });

    setShowForm(true);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const setDefaultAddress = async (addressId) => {
    try {
      setBusyId(addressId);
      setError("");
      setSuccess("");

      const response = await axios.put(
        `${API_URL}/addresses/${customer._id}/${addressId}/default`
      );

      setAddresses(response.data.addresses || []);
      setSuccess("Default address updated.");
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Default address could not be updated."
      );
    } finally {
      setBusyId(null);
    }
  };

  const deleteAddress = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyId(addressId);
      setError("");
      setSuccess("");

      const response = await axios.delete(
        `${API_URL}/addresses/${customer._id}/${addressId}`
      );

      setAddresses(response.data.addresses || []);
      setSuccess("Address deleted successfully.");

      if (editingId === addressId) {
        resetForm();
      }
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Address could not be deleted."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7ed] px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-full bg-white border flex items-center justify-center hover:bg-black hover:text-white"
            >
              <FaArrowLeft />
            </button>

            <div>
              <h1 className="text-4xl font-black text-[#1e1b4b]">
                My Addresses
              </h1>

              <p className="text-gray-500 mt-2">
                Manage your delivery addresses.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(EMPTY_FORM);
              setShowForm(true);
              setError("");
              setSuccess("");
            }}
            className="flex items-center justify-center gap-2 bg-[#7c3aed] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#6d28d9]"
          >
            <FaPlus />
            Add Address
          </button>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex justify-between">
            <span>{error}</span>

            <button onClick={() => setError("")}>
              <FaTimes />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl flex justify-between">
            <span>{success}</span>

            <button onClick={() => setSuccess("")}>
              <FaTimes />
            </button>
          </div>
        )}

        {showForm && (
          <form
            onSubmit={saveAddress}
            className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>

              <button
                type="button"
                onClick={resetForm}
                className="w-10 h-10 border rounded-full flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>

            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating}
              className="mb-6 w-full flex items-center justify-center gap-2 border-2 border-[#7c3aed] text-[#7c3aed] py-3 rounded-xl font-bold hover:bg-purple-50 disabled:opacity-50"
            >
              <FaMapMarkerAlt />
              {locating
                ? "Detecting your location..."
                : "Use My Current Location"}
            </button>

            <p className="text-sm text-gray-500 -mt-4 mb-6">
              Or enter your address manually below — city and state
              fill in automatically once you type your pincode.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              <AddressInput
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />

              <AddressInput
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                required
              />

              <AddressInput
                label="House / Flat"
                name="house"
                value={form.house}
                onChange={handleChange}
                required
              />

              <AddressInput
                label="Area / Street"
                name="area"
                value={form.area}
                onChange={handleChange}
              />

              <AddressInput
                label="Landmark"
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
              />

              <AddressInput
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />

              <AddressInput
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
              />

              <AddressInput
                label={
                  pincodeLookupLoading
                    ? "Pincode (looking up city/state...)"
                    : "Pincode"
                }
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                maxLength={6}
                required
              />

              <div>
                <label className="block font-bold mb-2">
                  Address Type
                </label>

                <select
                  name="addressType"
                  value={form.addressType}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 outline-none bg-white"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-2">
                  Country
                </label>

                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 outline-none"
                />
              </div>
            </div>

            <label className="mt-5 flex items-center gap-3">
              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
                className="w-5 h-5"
              />

              <span className="font-semibold">
                Set as default address
              </span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="mt-7 w-full bg-black text-white py-4 rounded-xl font-bold disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Address"
                : "Save Address"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-gray-200 border-t-[#7c3aed] animate-spin" />

            <p className="mt-4 font-semibold">
              Loading addresses...
            </p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-3xl shadow p-16 text-center">
            <FaMapMarkerAlt className="text-7xl text-gray-300 mx-auto" />

            <h2 className="text-3xl font-black mt-5">
              No Saved Addresses
            </h2>

            <p className="text-gray-500 mt-2">
              Add an address to make checkout faster.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`bg-white rounded-3xl p-6 shadow-lg border-2 ${
                  address.isDefault
                    ? "border-[#7c3aed]"
                    : "border-transparent"
                }`}
              >
                <div className="flex justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-purple-100 text-[#7c3aed] flex items-center justify-center">
                      <FaHome />
                    </div>

                    <div>
                      <h3 className="font-black text-xl">
                        {address.addressType}
                      </h3>

                      {address.isDefault && (
                        <span className="text-xs font-bold text-[#7c3aed]">
                          Default Address
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-gray-700 leading-7">
                  <p className="font-black text-gray-900">
                    {address.fullName}
                  </p>

                  <p>{address.phone}</p>

                  <p>
                    {address.house}
                    {address.area ? `, ${address.area}` : ""}
                  </p>

                  {address.landmark && (
                    <p>Landmark: {address.landmark}</p>
                  )}

                  <p>
                    {address.city}, {address.state} -{" "}
                    {address.pincode}
                  </p>

                  <p>{address.country}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() =>
                        setDefaultAddress(address._id)
                      }
                      disabled={busyId === address._id}
                      className="flex items-center justify-center gap-2 border py-3 rounded-xl font-bold hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FaCheck />
                      Set Default
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => startEditing(address)}
                    className="flex items-center justify-center gap-2 border py-3 rounded-xl font-bold hover:bg-gray-100"
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteAddress(address._id)
                    }
                    disabled={busyId === address._id}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white disabled:opacity-50"
                  >
                    <FaTrash />
                    Delete
                  </button>

                  <button
  type="button"
  onClick={() => {
    setSelectedAddress(address);
    navigate("/checkout");
  }}
  className="flex items-center justify-center gap-2 bg-[#7c3aed] text-white py-3 rounded-xl font-bold hover:bg-[#6d28d9]"
>
  <FaCheck />
  Deliver Here
</button>

                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/cart"
            className="inline-block bg-[#7c3aed] text-white px-8 py-3 rounded-xl font-bold"
          >
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}

function AddressInput({
  label,
  name,
  value,
  onChange,
  required = false,
  maxLength,
}) {
  return (
    <div>
      <label className="block font-bold mb-2">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        className="w-full border rounded-xl p-3 outline-none focus:border-[#7c3aed]"
      />
    </div>
  );
}