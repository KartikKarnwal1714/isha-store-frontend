import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // -----------------------------
  // State
  // -----------------------------

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedAddress, setSelectedAddress] = useState(() => {
    const saved = localStorage.getItem("selectedAddress");
    return saved ? JSON.parse(saved) : null;
  });

  const [coupon, setCoupon] = useState(() => {
    const saved = localStorage.getItem("coupon");
    return saved ? JSON.parse(saved) : null;
  });

  const [shippingMethod, setShippingMethod] = useState(() => {
    return (
      localStorage.getItem("shippingMethod") ||
      "standard"
    );
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    return (
      localStorage.getItem("paymentMethod") || ""
    );
  });

  // -----------------------------
  // Save to LocalStorage
  // -----------------------------

  useEffect(() => {
    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(
      "selectedAddress",
      JSON.stringify(selectedAddress)
    );
  }, [selectedAddress]);

  useEffect(() => {
    localStorage.setItem(
      "coupon",
      JSON.stringify(coupon)
    );
  }, [coupon]);

  useEffect(() => {
    localStorage.setItem(
      "shippingMethod",
      shippingMethod
    );
  }, [shippingMethod]);

  useEffect(() => {
    localStorage.setItem(
      "paymentMethod",
      paymentMethod
    );
  }, [paymentMethod]);

  // -----------------------------
  // Cart Functions
  // -----------------------------

  const addToCart = (product) => {
    const existingItem = cartItems.find(
      (item) =>
        item._id === product._id &&
        item.selectedSize ===
          product.selectedSize &&
        item.selectedColor ===
          product.selectedColor
    );

    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === product._id &&
          item.selectedSize ===
            product.selectedSize &&
          item.selectedColor ===
            product.selectedColor
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item._id !== id)
    );
  };

  const updateQuantity = (id, type) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id !== id) return item;

        if (type === "increase") {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }

        if (type === "decrease") {
          return {
            ...item,
            quantity:
              item.quantity > 1
                ? item.quantity - 1
                : 1,
          };
        }

        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // -----------------------------
  // Clear Entire Checkout
  // Call after successful payment
  // -----------------------------

  const clearCheckout = () => {
    setCartItems([]);
    setSelectedAddress(null);
    setCoupon(null);
    setShippingMethod("standard");
    setPaymentMethod("");

    localStorage.removeItem("cartItems");
    localStorage.removeItem("selectedAddress");
    localStorage.removeItem("coupon");
    localStorage.removeItem("shippingMethod");
    localStorage.removeItem("paymentMethod");
  };

  // -----------------------------
  // Calculations
  // -----------------------------

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const shipping =
    shippingMethod === "express"
      ? 199
      : subtotal >= 999
      ? 0
      : 99;

  const discount =
    coupon?.discount || 0;

  const tax = Math.round(
    subtotal * 0.18
  );

  const grandTotal =
    subtotal +
    shipping +
    tax -
    discount;

  // -----------------------------
  // Context
  // -----------------------------

  return (
    <CartContext.Provider
      value={{
        // Cart
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        // Totals
        subtotal,
        totalItems,
        shipping,
        tax,
        discount,
        grandTotal,

        // Address
        selectedAddress,
        setSelectedAddress,

        // Coupon
        coupon,
        setCoupon,

        // Shipping
        shippingMethod,
        setShippingMethod,

        // Payment
        paymentMethod,
        setPaymentMethod,

        // Checkout
        clearCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);