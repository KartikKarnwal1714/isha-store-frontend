import { useState, useEffect } from "react";
import { useCart } from "../CartContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { FaShoppingCart, FaTrash } from "react-icons/fa";

import Navbar from "../components/Navbar";
import { API_URL } from "../utils/apiUrl";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    setSelectedAddress,
  } = useCart();

  const [coupon, setCoupon] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [savedAddresses, setSavedAddresses] =
  useState([]);

const [selectedAddressId, setSelectedAddressId] =
  useState("");

const [addressesLoading, setAddressesLoading] =
  useState(false);

const [useManualAddress, setUseManualAddress] =
  useState(false);

  const getCartItemPrice = (item) => {
  return Number(
    item.price ||
      item.selectedSize?.price ||
      item.minimumPrice ||
      item.colors?.[0]?.sizes?.[0]?.price ||
      0
  );
};

 const getCartItemOriginalPrice = (item) => {
  return Number(
    item.originalPrice ||
      item.selectedSize?.originalPrice ||
      item.minimumOriginalPrice ||
      item.colors?.[0]?.sizes?.[0]
        ?.originalPrice ||
      0
  );
};

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getCartItemPrice(item) * item.quantity,
    0
  );

  const shipping = subtotal > 3000 ? 0 : 99;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax - discount;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/coupons`
        );

        const today = new Date();

        const activeCoupons = (res.data.coupons || []).filter(
          (item) => {
            if (!item.isActive) return false;

            if (item.startDate && today < new Date(item.startDate)) {
              return false;
            }

            if (item.endDate && today > new Date(item.endDate)) {
              return false;
            }

            return true;
          }
        );

        setAvailableCoupons(activeCoupons);
      } catch (error) {
        console.log("Coupon Fetch Error:", error);
      }
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
  const fetchSavedAddresses = async () => {
    let savedCustomer = null;

    try {
      savedCustomer = JSON.parse(
        localStorage.getItem("customer") || "null"
      );
    } catch (error) {
      console.error(
        "Customer parse error:",
        error
      );
    }

    if (!savedCustomer?._id) {
      setSavedAddresses([]);
      setUseManualAddress(true);
      return;
    }

    try {
      setAddressesLoading(true);

      const response = await axios.get(
        `${API_URL}/addresses/${savedCustomer._id}`
      );

      const receivedAddresses = Array.isArray(
        response.data?.addresses
      )
        ? response.data.addresses
        : [];

      setSavedAddresses(receivedAddresses);

      const defaultAddress =
        receivedAddresses.find(
          (item) => item.isDefault
        ) || receivedAddresses[0];

      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
        setSelectedAddress(defaultAddress);

        setCustomerName(
          defaultAddress.fullName || ""
        );

        setPhone(defaultAddress.phone || "");

        setAddress(
          [
            defaultAddress.house,
            defaultAddress.area,
          ]
            .filter(Boolean)
            .join(", ")
        );

        setCity(defaultAddress.city || "");
        setState(defaultAddress.state || "");
        setPincode(defaultAddress.pincode || "");

        setUseManualAddress(false);
      } else {
        setUseManualAddress(true);
      }
    } catch (error) {
      console.error(
        "Address fetch error:",
        error.response?.data ||
          error.message
      );

      setSavedAddresses([]);
      setUseManualAddress(true);
    } finally {
      setAddressesLoading(false);
    }
  };

  fetchSavedAddresses();
}, []);


  const applyCoupon = async () => {
    if (!coupon) {
      alert("Select coupon code");
      return;
    }

    if (subtotal <= 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setCouponLoading(true);

      const res = await axios.post(
        `${API_URL}/coupons/apply`,
        {
          code: coupon,
          subtotal,
        }
      );

      setDiscount(res.data.discount || 0);
      setAppliedCoupon(res.data.couponCode);

      alert("Coupon Applied Successfully");
    } catch (error) {
      console.log(error);
      setDiscount(0);
      setAppliedCoupon("");

      alert(
        error.response?.data?.message ||
          "Invalid Coupon"
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setAppliedCoupon("");
    setDiscount(0);
  };

  const handleRemoveFromCart = async (item) => {
    const customer = JSON.parse(localStorage.getItem("customer"));

    try {
      if (customer?._id) {
        await axios.post(`${API_URL}/cart/remove`, {
          userId: customer._id,
          productId: item._id,
        });
      }

      removeFromCart(item._id);

      alert("Item removed from cart");
    } catch (error) {
      console.log(error);
      alert("Remove failed");
    }
  };

  const selectSavedAddress = (addressId) => {
  setSelectedAddressId(addressId);

  const selectedAddress = savedAddresses.find(
    (item) => item._id === addressId
  );

  if (!selectedAddress) {
    return;
  }

  setSelectedAddress(selectedAddress);

  setCustomerName(selectedAddress.fullName || "");
  setPhone(selectedAddress.phone || "");

  setAddress(
    [
      selectedAddress.house,
      selectedAddress.area,
    ]
      .filter(Boolean)
      .join(", ")
  );

  setCity(selectedAddress.city || "");
  setState(selectedAddress.state || "");
  setPincode(selectedAddress.pincode || "");

  setUseManualAddress(false);
};

  const placeOrder = async () => {
  // =========================================
  // BASIC FORM VALIDATION
  // =========================================

  if (!customerName.trim()) {
    alert("Enter Name");
    return;
  }


if (!/^[6-9]\d{9}$/.test(phone.trim())) {
  alert("Enter a valid 10-digit phone number");
  return;
}

if (!address.trim()) {
  alert("Enter House / Flat / Area");
  return;
}

if (!city.trim()) {
  alert("Enter City");
  return;
}

if (!state.trim()) {
  alert("Enter State");
  return;
}

if (!/^\d{6}$/.test(pincode.trim())) {
  alert("Enter a valid 6-digit pincode");
  return;
}

  if (cartItems.length === 0) {
    alert("Cart Empty");
    return;
  }

  // =========================================
  // GET LOGGED-IN CUSTOMER
  // =========================================

  let savedCustomer = null;

  try {
    savedCustomer = JSON.parse(
      localStorage.getItem("customer") || "null"
    );
  } catch (error) {
    console.error("Invalid customer data:", error);
  }

  if (!savedCustomer?._id) {
    alert(
      "Please log in again before placing the order."
    );

    navigate("/login");
    return;
  }

  try {
    const orderData = {
      customerId: savedCustomer._id,

      selectedAddressId: selectedAddressId || null,

      customerPhone:
        savedCustomer.phone || phone.trim(),

      customerName: customerName.trim(),

      email: savedCustomer.email || "",

      phone: phone.trim(),

      address: {
  house: address.trim(),
  city: city.trim(),
  state: state.trim(),
  pincode: pincode.trim(),

  landmark:
    savedAddresses.find(
      (item) =>
        item._id === selectedAddressId
    )?.landmark || "",

  area:
    savedAddresses.find(
      (item) =>
        item._id === selectedAddressId
    )?.area || "",

  country:
    savedAddresses.find(
      (item) =>
        item._id === selectedAddressId
    )?.country || "India",

  addressType:
    savedAddresses.find(
      (item) =>
        item._id === selectedAddressId
    )?.addressType || "Home",
},

      products: cartItems.map((item) => {
        const productId =
          item.productId ||
          item.product?._id ||
          item._id;

        const selectedSize =
          typeof item.selectedSize === "object"
            ? item.selectedSize?.size
            : item.selectedSize;

        const selectedColor =
          typeof item.selectedColor === "object"
            ? item.selectedColor?.colorName
            : item.selectedColor;

        const productImage =
          item.image ||
          item.images?.[0] ||
          item.colors?.[0]?.images?.[0] ||
          "";

        return {
          productId,

          name:
            item.title ||
            item.name ||
            "Product",

          image: productImage,

          price: getCartItemPrice(item),

          originalPrice:
            getCartItemOriginalPrice(item),

          quantity: Number(item.quantity || 1),

          size: selectedSize || "",

          color: selectedColor || "",
        };
      }),

      subtotal: Number(subtotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      couponCode: appliedCoupon || "",
      total: Number(total.toFixed(2)),

      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Pending",
    };

    console.log("Order payload:", orderData);

    const response = await axios.post(
      `${API_URL}/orders/create`,
      orderData
    );

    alert(
      response.data.message ||
        "Order Placed Successfully"
    );

    clearCart();
    removeCoupon();

    navigate("/current-orders");
  } catch (error) {
    console.error(
      "Place order error:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
        "Failed To Place Order"
    );
  }
};

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar variant="page" />

      <div className="px-4 sm:px-8 pt-5 sm:pt-10">
        <h1 className="text-2xl sm:text-5xl font-black">
          Shopping Cart
        </h1>

        <p className="text-gray-500 mt-1.5 sm:mt-3 text-sm sm:text-lg">
          Manage your selected products
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-10 px-4 sm:px-8 py-5 sm:py-10">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.length === 0 ? (
            <div className="bg-white p-8 sm:p-16 rounded-2xl sm:rounded-[35px] text-center shadow-lg">
              <FaShoppingCart className="text-4xl sm:text-7xl mx-auto mb-4 sm:mb-6 text-gray-400" />

              <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3">
                Cart is Empty
              </h2>

              <p className="text-gray-500 text-sm sm:text-lg">
                Add products to continue shopping
              </p>

              <Link to="/">
                <button className="mt-8 bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition">
                  Explore Products
                </button>
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item._id}-${item.selectedSize || ""}-${item.selectedColor || ""}`}
                className="bg-white rounded-2xl sm:rounded-[30px] p-3 sm:p-5 shadow-lg flex flex-row gap-3 sm:gap-5 items-start sm:items-center"
              >
                <img
                  src={item.images?.[0] || item.image}
                  alt={item.title || item.name}
                  className="w-20 h-20 sm:w-36 sm:h-36 rounded-xl sm:rounded-[25px] object-cover shrink-0"
                />

                <div className="flex-1 w-full min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-2xl font-bold line-clamp-2">
                        {item.title || item.name}
                      </h2>

                      <p className="text-gray-500 text-xs sm:text-base mt-0.5 sm:mt-1">
                        {item.category}
                      </p>

                      <p className="text-[11px] sm:text-sm text-gray-400 mt-1">
                        Color: {item.selectedColor}
                      </p>

                      <p className="text-[11px] sm:text-sm text-gray-400">
                        Size: {item.selectedSize}
                      </p>
                    </div>

                    <p className="text-sm sm:text-2xl font-black shrink-0">
                      ₹{getCartItemPrice(item) * item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-6">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, "decrease")
                      }
                      className="w-7 h-7 sm:w-10 sm:h-10 text-sm sm:text-base rounded-full bg-gray-200 hover:bg-black hover:text-white transition"
                    >
                      -
                    </button>

                    <span className="text-sm sm:text-xl font-bold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item._id, "increase")
                      }
                      className="w-7 h-7 sm:w-10 sm:h-10 text-sm sm:text-base rounded-full bg-gray-200 hover:bg-black hover:text-white transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button onClick={() => handleRemoveFromCart(item)}>
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-2xl sm:rounded-[35px] p-4 sm:p-8 shadow-lg h-fit lg:sticky lg:top-28">
          <h2 className="text-xl sm:text-4xl font-black mb-4 sm:mb-8">
            Order Summary
          </h2>

          <div className="space-y-5">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>

            <div className="flex justify-between text-lg">
              <span>Tax (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg text-green-600">
              <span>
                Discount {appliedCoupon && `(${appliedCoupon})`}
              </span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex gap-3">
              <select
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="w-full border p-4 rounded-2xl outline-none focus:border-black"
              >
                <option value="">
                  Select Coupon
                </option>

                {availableCoupons.map((item) => (
                  <option key={item._id} value={item.code}>
                    {item.code} -{" "}
                    {item.discountType === "percent"
                      ? `${item.discountValue}% OFF`
                      : `₹${item.discountValue} OFF`}
                  </option>
                ))}
              </select>

              <button
                onClick={applyCoupon}
                disabled={couponLoading}
                className="bg-black text-white px-5 rounded-2xl disabled:bg-gray-400"
              >
                {couponLoading ? "..." : "Apply"}
              </button>
            </div>

            {availableCoupons.length === 0 && (
              <p className="text-sm text-gray-500 mt-3">
                No active coupons available.
              </p>
            )}

            {appliedCoupon && (
              <button
                onClick={removeCoupon}
                className="text-red-500 text-sm mt-3"
              >
                Remove Coupon
              </button>
            )}
          </div>

          <div className="mt-8">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-xl font-black">
        Delivery Address
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        Select a saved address or enter a new one.
      </p>
    </div>

    <Link
      to="/addresses"
      className="text-[#7c3aed] text-sm font-bold"
    >
      Manage Addresses
    </Link>
  </div>

  {addressesLoading ? (
    <div className="border rounded-2xl p-5 text-center">
      <div className="w-9 h-9 mx-auto border-4 border-gray-200 border-t-[#7c3aed] rounded-full animate-spin" />

      <p className="text-sm text-gray-500 mt-3">
        Loading addresses...
      </p>
    </div>
  ) : savedAddresses.length > 0 ? (
    <div className="space-y-3">
      {savedAddresses.map(
        (savedAddress) => (
          <label
            key={savedAddress._id}
            className={`block border-2 rounded-2xl p-4 cursor-pointer transition ${
              selectedAddressId ===
              savedAddress._id
                ? "border-[#7c3aed] bg-purple-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex gap-3">
              <input
                type="radio"
                name="savedAddress"
                value={savedAddress._id}
                checked={
                  selectedAddressId ===
                  savedAddress._id
                }
                onChange={() =>
                  selectSavedAddress(
                    savedAddress._id
                  )
                }
                className="mt-1"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-black">
                    {savedAddress.fullName}
                  </p>

                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-bold">
                    {savedAddress.addressType}
                  </span>

                  {savedAddress.isDefault && (
                    <span className="text-xs bg-purple-100 text-[#7c3aed] px-2 py-1 rounded-full font-bold">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  {savedAddress.house}
                  {savedAddress.area
                    ? `, ${savedAddress.area}`
                    : ""}
                </p>

                {savedAddress.landmark && (
                  <p className="text-sm text-gray-600">
                    Landmark:{" "}
                    {savedAddress.landmark}
                  </p>
                )}

                <p className="text-sm text-gray-600">
                  {savedAddress.city},{" "}
                  {savedAddress.state} -{" "}
                  {savedAddress.pincode}
                </p>

                <p className="text-sm text-gray-600">
                  Phone: {savedAddress.phone}
                </p>
              </div>
            </div>
          </label>
        )
      )}

      <button
        type="button"
        onClick={() => {
          setUseManualAddress(true);
          setSelectedAddressId("");
          setCustomerName("");
          setPhone("");
          setAddress("");
          setCity("");
          setState("");
          setPincode("");
        }}
        className="w-full border-2 border-dashed border-gray-300 py-3 rounded-2xl font-bold hover:border-[#7c3aed] hover:text-[#7c3aed]"
      >
        Enter a Different Address
      </button>
    </div>
  ) : (
    <div className="border border-dashed rounded-2xl p-5 text-center">
      <p className="font-bold">
        No saved address found
      </p>

      <Link
        to="/addresses"
        className="inline-block mt-3 text-[#7c3aed] font-bold"
      >
        Add Address
      </Link>
    </div>
  )}

  {useManualAddress && (
    <div className="space-y-3 mt-5 border-t pt-5">
      <div className="flex items-center justify-between">
        <h4 className="font-black">
          New Delivery Address
        </h4>

        {savedAddresses.length > 0 && (
          <button
            type="button"
            onClick={() => {
              const defaultAddress =
                savedAddresses.find(
                  (item) =>
                    item.isDefault
                ) || savedAddresses[0];

              if (defaultAddress) {
                selectSavedAddress(
                  defaultAddress._id
                );
              }
            }}
            className="text-sm text-[#7c3aed] font-bold"
          >
            Use Saved Address
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Full Name"
        value={customerName}
        onChange={(event) =>
          setCustomerName(event.target.value)
        }
        className="w-full border p-3 rounded-xl"
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(event) =>
          setPhone(
            event.target.value
              .replace(/\D/g, "")
              .slice(0, 10)
          )
        }
        maxLength={10}
        className="w-full border p-3 rounded-xl"
      />

      <input
        type="text"
        placeholder="House / Flat / Area"
        value={address}
        onChange={(event) =>
          setAddress(event.target.value)
        }
        className="w-full border p-3 rounded-xl"
      />

      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(event) =>
          setCity(event.target.value)
        }
        className="w-full border p-3 rounded-xl"
      />

      <input
        type="text"
        placeholder="State"
        value={state}
        onChange={(event) =>
          setState(event.target.value)
        }
        className="w-full border p-3 rounded-xl"
      />

      <input
        type="text"
        placeholder="Pincode"
        value={pincode}
        onChange={(event) =>
          setPincode(
            event.target.value
              .replace(/\D/g, "")
              .slice(0, 6)
          )
        }
        maxLength={6}
        className="w-full border p-3 rounded-xl"
      />
    </div>
  )}
</div>

          <div className="border-t mt-8 pt-8 flex justify-between text-3xl font-black">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-8 bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}