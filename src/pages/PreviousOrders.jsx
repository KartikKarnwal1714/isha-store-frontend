import { useEffect, useState } from "react";
import api from "../api/client";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";

import {
  FaArrowLeft,
  FaFileInvoice,
  FaRedo,
  FaTruck,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCopy,
  FaExternalLinkAlt,
  FaShoppingBag,
  FaUndo,
  FaStar,
  FaCheck,
} from "react-icons/fa";

export default function PreviousOrders() {
  const navigate = useNavigate();
  const { customer, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchOrders = async () => {
    if (!customer?._id) {
      setLoading(false);
      setError("");
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/orders/my-orders/${customer._id}`
      );

      const receivedOrders =
        response.data?.orders || [];

      const previousOrders =
        receivedOrders.filter((order) =>
          [
            "Delivered",
            "Cancelled",
            "Returned",
          ].includes(order.orderStatus)
        );

      setOrders(previousOrders);
    } catch (requestError) {
      console.error(
        "Previous orders error:",
        requestError
      );

      setOrders([]);

      setError(
        requestError.response?.data?.message ||
          "Previous orders could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (customer?._id) {
      fetchOrders();
    } else {
      setLoading(false);
      setOrders([]);
    }
  }, [customer, authLoading]);

  if (!authLoading && !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff7ed] px-6 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-xl w-full">
          <h1 className="text-4xl font-black mb-4">
            Login required
          </h1>
          <p className="text-gray-500 mb-8">
            You must be logged in to view your previous orders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl border border-gray-300 font-bold hover:bg-gray-100 transition"
            >
              Go Back
            </button>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-900 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getShortOrderId = (orderId) => {
    return String(orderId || "")
      .slice(-8)
      .toUpperCase();
  };

  const formatDate = (date) => {
  if (!date) return "Not Available";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getProductImage = (item) => {
  return (
    item.image ||
    item.productImage ||
    item.images?.[0] ||
    "https://via.placeholder.com/300x300?text=No+Image"
  );
};

const copyTrackingNumber = async (tracking) => {
  if (!tracking) return;

  try {
    await navigator.clipboard.writeText(tracking);
    alert("Tracking ID copied");
  } catch {}
};

const getStatusClass = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    case "Returned":
      return "bg-gray-200 text-gray-700";

    default:
      return "bg-orange-100 text-orange-700";
  }
};

  const getCustomer = () => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "customer"
        ) || "null"
      );
    } catch {
      return null;
    }
  };

  const downloadInvoice = async (
    orderId
  ) => {
    const customer = getCustomer();

    if (!customer?._id) {
      setError(
        "Please log in to download the invoice."
      );
      return;
    }

    try {
      setError("");

      const response = await api.get(
        `/orders/${orderId}/invoice`,
        {
          params: {
            customerId: customer._id,
          },
          responseType: "blob",
        }
      );

      const pdfBlob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const downloadUrl =
        window.URL.createObjectURL(
          pdfBlob
        );

      const downloadLink =
        document.createElement("a");

      downloadLink.href = downloadUrl;

      downloadLink.download =
        `Invoice-${getShortOrderId(
          orderId
        )}.pdf`;

      document.body.appendChild(
        downloadLink
      );

      downloadLink.click();
      downloadLink.remove();

      window.URL.revokeObjectURL(
        downloadUrl
      );
    } catch (requestError) {
      console.error(
        "Invoice download error:",
        requestError
      );

      setError(
        "Invoice could not be downloaded."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7ed] px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">

<div className="flex items-center gap-4">

<button
onClick={()=>navigate(-1)}
className="w-12 h-12 bg-white border rounded-full flex items-center justify-center hover:bg-black hover:text-white transition"
>

<FaArrowLeft/>

</button>

<div>

<h1 className="text-5xl font-black">
Previous Orders
</h1>

<p className="text-gray-500 mt-2">
Completed, Returned & Cancelled Orders
</p>

</div>

</div>

<button

onClick={fetchOrders}

className="bg-white border px-5 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-black hover:text-white transition"
>

<FaRedo/>

Refresh

</button>

</div>

      {error && (
        <div className="bg-red-100 text-red-700 rounded-2xl p-4 mb-6 font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl p-10 shadow">
          <h2 className="text-2xl font-bold">
            Loading orders...
          </h2>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow">
          <h2 className="text-2xl font-bold">
            No previous orders
          </h2>
        </div>
      ) : (
        <div className="space-y-6">
         {orders.map((order) => (

<div
key={order._id}
className="bg-white rounded-3xl overflow-hidden shadow-md border hover:shadow-xl transition-all duration-300"
>

{/* HEADER */}

<div className="bg-gradient-to-r from-orange-50 to-white p-6">

<div className="flex flex-col lg:flex-row justify-between gap-5">

<div>

<div className="flex items-center gap-3 flex-wrap">

<h2 className="text-2xl font-black">

Order #{getShortOrderId(order._id)}

</h2>

<span
className={`px-4 py-1 rounded-full text-sm font-bold ${getStatusClass(order.orderStatus)}`}
>

{order.orderStatus}

</span>

</div>

<p className="text-gray-500 mt-2">

Ordered on {formatDate(order.createdAt)}

</p>

</div>

<div className="text-left lg:text-right">

<p className="text-sm text-gray-500">

Total Amount

</p>

<h2 className="text-3xl font-black">

₹{Number(order.total).toLocaleString("en-IN")}

</h2>

</div>

</div>

</div>

{/* PRODUCTS */}

{order.products.map((item,index)=>(

<div
key={index}
className="border-t p-5 flex flex-col lg:flex-row gap-5"
>

<img
src={getProductImage(item)}
className="w-28 h-28 rounded-2xl object-cover bg-gray-100"
/>

<div className="flex-1">

<h3 className="text-xl font-bold">

{item.name}

</h3>

<div className="text-gray-600 mt-2">

{item.color || "Default"}

•

{item.size || "Free Size"}

•

Qty {item.quantity}

</div>

<div className="mt-3 font-semibold">

Sold by ISHA STORE

</div>

<div className="text-3xl font-black mt-4">

₹{Number(item.price).toLocaleString("en-IN")}

</div>

</div>

</div>

))}

<div className="border-t p-6 bg-gray-50">

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

<div className="flex items-center gap-3">

<FaMoneyBillWave className="text-green-600"/>

<div>

<p className="text-xs text-gray-500">

Payment

</p>

<p className="font-bold">

{order.paymentStatus}

</p>

</div>

</div>

<div className="flex items-center gap-3">

<FaTruck/>

<div>

<p className="text-xs text-gray-500">

Courier

</p>

<p className="font-bold">

{order.courierCompany || "Not Assigned"}

</p>

</div>

</div>

<div className="flex items-center gap-3">

<FaCalendarAlt/>

<div>

<p className="text-xs text-gray-500">

Delivered On

</p>

<p className="font-bold">

{formatDate(order.deliveredAt)}

</p>

</div>

</div>

<div className="flex items-center gap-3">

<FaMapMarkerAlt/>

<div>

<p className="text-xs text-gray-500">

Tracking ID

</p>

<div className="flex items-center gap-2">

<p className="font-bold">

{order.trackingNumber || "--"}

</p>

{order.trackingNumber && (

<button
onClick={()=>copyTrackingNumber(order.trackingNumber)}
>

<FaCopy/>

</button>

)}

</div>

</div>

</div>

</div>

</div>

{/* PRICE DETAILS */}

<div className="border-t p-6">

<h3 className="text-xl font-black mb-5">

Price Details

</h3>

<div className="max-w-md space-y-3">

<div className="flex justify-between">

<span className="text-gray-600">
Subtotal
</span>

<span className="font-semibold">
₹{Number(order.subtotal || order.total).toLocaleString("en-IN")}
</span>

</div>

<div className="flex justify-between">

<span className="text-gray-600">
Discount
</span>

<span className="text-green-600 font-semibold">

- ₹{Number(order.discount || 0).toLocaleString("en-IN")}

</span>

</div>

<div className="flex justify-between">

<span className="text-gray-600">
Coupon Discount
</span>

<span className="text-green-600 font-semibold">

- ₹{Number(order.couponDiscount || 0).toLocaleString("en-IN")}

</span>

</div>

<div className="flex justify-between">

<span className="text-gray-600">
Shipping Charge
</span>

<span className="font-semibold">

₹{Number(order.shippingCharge || 0).toLocaleString("en-IN")}

</span>

</div>

<div className="flex justify-between">

<span className="text-gray-600">
GST
</span>

<span className="font-semibold">

₹{Number(order.tax || 0).toLocaleString("en-IN")}

</span>

</div>

<hr/>

<div className="flex justify-between text-xl font-black">

<span>
Grand Total
</span>

<span>

₹{Number(order.total).toLocaleString("en-IN")}

</span>

</div>

</div>

</div>

{/* CUSTOMER DETAILS */}

<div className="border-t p-6 bg-gray-50">

<h3 className="text-xl font-black mb-5">

Customer Details

</h3>

<div className="grid md:grid-cols-2 gap-5">

<div>

<p className="text-gray-500">
Customer Name
</p>

<p className="font-bold">
{order.customerName}
</p>

</div>

<div>

<p className="text-gray-500">
Phone Number
</p>

<p className="font-bold">
{order.phone}
</p>

</div>

<div>

<p className="text-gray-500">
Email
</p>

<p className="font-bold break-all">
{order.email}
</p>

</div>

<div>

<p className="text-gray-500">
Payment Method
</p>

<p className="font-bold">
{order.paymentMethod}
</p>

</div>

<div className="md:col-span-2">

<p className="text-gray-500">
Shipping Address
</p>

<p className="font-bold">

{order.address}

</p>

</div>

</div>

</div>

{/* ACTION BUTTONS */}

<div className="border-t p-6 flex flex-wrap gap-3">

{/* BUY AGAIN */}

<button
type="button"
className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition"
>

<FaShoppingBag/>

Buy Again

</button>

{/* DOWNLOAD INVOICE */}

<button
type="button"
onClick={() => downloadInvoice(order._id)}
className="flex items-center gap-2 border px-6 py-3 rounded-xl font-bold hover:bg-black hover:text-white transition"
>

<FaFileInvoice/>

Invoice

</button>

{/* WRITE REVIEW */}

{order.orderStatus === "Delivered" && (

<button
type="button"
className="flex items-center gap-2 border border-yellow-500 text-yellow-600 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 hover:text-white transition"
>

<FaStar/>

Write Review

</button>

)}

{/* RETURN */}

{order.orderStatus === "Delivered" && (

<button
type="button"
className="flex items-center gap-2 border border-orange-500 text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition"
>

<FaUndo/>

Return

</button>

)}

{/* TRACK SHIPMENT */}

{order.trackingUrl && (

<a
href={order.trackingUrl}
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-2 border border-blue-500 text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition"
>

<FaExternalLinkAlt/>

Track Shipment

</a>

)}

</div>

        </div>
          ))}
        </div>
      )}
    </div>
  );
}