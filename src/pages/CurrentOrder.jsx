import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBox,
  FaCheck,
  FaClock,
  FaExclamationTriangle,
  FaFileInvoice,
  FaRedo,
  FaShippingFast,
  FaTimes,
  FaUndo,
  FaTruck,
  FaClipboardCheck,
  FaCog,
  FaCopy,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

const NORMAL_ORDER_STEPS = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const RETURN_STEPS = [
  "Return Requested",
  "Return Approved",
  "Returned",
];

const CANCELLABLE_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
];

const RETURN_REASONS = [
  "Damaged product",
  "Wrong product received",
  "Wrong size",
  "Product quality issue",
  "Product different from description",
  "No longer needed",
  "Other",
];

const CANCELLATION_REASONS = [
  "Ordered by mistake",
  "Wrong size selected",
  "Wrong address entered",
  "Found a better price",
  "Delivery is taking too long",
  "No longer needed",
  "Other",
];

export default function CurrentOrder() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const [expandedOrderId, setExpandedOrderId] =
    useState(null);

  const [actionOrder, setActionOrder] = useState(null);
  const [actionType, setActionType] = useState("");

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const customer = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("customer") || "null"
      );
    } catch {
      return null;
    }
  }, []);


  // ====================================================
  // FETCH CUSTOMER ORDERS
  // ====================================================

  const fetchOrders = async () => {
    if (!customer?._id) {
      setLoading(false);
      setPageError(
        "Please log in to view your current orders."
      );
      return;
    }

    try {
      setLoading(true);
      setPageError("");

      const response = await api.get(
  `/orders/my-orders/${customer._id}`
);

      const receivedOrders =
        response.data.orders || response.data || [];

      /*
       * We keep delivered orders visible because a customer
       * may need to request a return within seven days.
       *
       * Old cancelled or completely returned orders can be
       * shown on a separate order-history page later.
       */
      const visibleOrders = receivedOrders.filter(
        (order) =>
          order.orderStatus !== "Cancelled" &&
          order.orderStatus !== "Returned"
      );

      visibleOrders.sort(
        (first, second) =>
          new Date(second.createdAt) -
          new Date(first.createdAt)
      );

      setOrders(visibleOrders);
    } catch (error) {
      console.error(
        "Current orders fetch error:",
        error.response?.data || error.message
      );

      setOrders([]);

      setPageError(
        error.response?.data?.message ||
          "Current orders could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  // ====================================================
  // HELPERS
  // ====================================================

  const getShortOrderId = (orderId) => {
    return String(orderId || "")
      .slice(-8)
      .toUpperCase();
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available";
    }

    return new Date(dateValue).toLocaleString("en-IN", {
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

  const downloadInvoice = async (
  orderId
) => {
  if (!customer?._id) {
    setPageError(
      "Please log in to download the invoice."
    );
    return;
  }

  try {
    setPageError("");

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
  } 
  catch (error) {
    console.error(
      "Invoice download error:",
      error
    );

    setPageError(
      error.response?.data?.message ||
        "Invoice could not be downloaded."
    );
  }
};

  const canCancelOrder = (order) => {
    return CANCELLABLE_STATUSES.includes(
      order.orderStatus
    );
  };

  const canReturnOrder = (order) => {
    if (
      order.orderStatus !== "Delivered" ||
      order.returnRequested
    ) {
      return false;
    }

    const deliveredDate =
      order.deliveredAt || order.updatedAt;

    if (!deliveredDate) {
      return false;
    }

    const deadline = new Date(deliveredDate);
    deadline.setDate(deadline.getDate() + 7);

    return new Date() <= deadline;
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      Pending: "bg-yellow-100 text-yellow-800",
      Confirmed: "bg-blue-100 text-blue-800",
      Processing: "bg-indigo-100 text-indigo-800",
      Packed: "bg-purple-100 text-purple-800",
      Shipped: "bg-cyan-100 text-cyan-800",
      "Out for Delivery":
        "bg-orange-100 text-orange-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
      "Return Requested":
        "bg-orange-100 text-orange-800",
      "Return Approved":
        "bg-blue-100 text-blue-800",
      "Return Rejected": "bg-red-100 text-red-800",
      Returned: "bg-gray-200 text-gray-800",
    };

    return (
      statusClasses[status] ||
      "bg-gray-100 text-gray-700"
    );
  };

  const getCurrentStepIndex = (status) => {
    return NORMAL_ORDER_STEPS.indexOf(status);
  };

  const getProgressPercentage = (status) => {
    const index = NORMAL_ORDER_STEPS.indexOf(status);

    if (index < 0) return 0;

    return Math.round(
      ((index + 1) / NORMAL_ORDER_STEPS.length) * 100
    );
  };

  const isNormalStepCompleted = (
    orderStatus,
    stepIndex
  ) => {
    const currentIndex =
      getCurrentStepIndex(orderStatus);

    return currentIndex >= stepIndex;
  };

  const isReturnStepCompleted = (
    orderStatus,
    stepIndex
  ) => {
    const currentIndex =
      RETURN_STEPS.indexOf(orderStatus);

    return currentIndex >= stepIndex;
  };

  // ====================================================
  // MODAL CONTROLS
  // ====================================================

  const openActionModal = (order, type) => {
    setActionOrder(order);
    setActionType(type);
    setReason("");
    setDescription("");
    setPageError("");
    setSuccessMessage("");
  };

  const closeActionModal = () => {
    if (submitting) {
      return;
    }

    setActionOrder(null);
    setActionType("");
    setReason("");
    setDescription("");
  };

  // ====================================================
  // CANCEL ORDER
  // ====================================================

  const submitCancellation = async () => {
    if (!actionOrder?._id) {
      return;
    }

    if (!reason.trim()) {
      setPageError(
        "Please select a cancellation reason."
      );
      return;
    }

    try {
      setSubmitting(true);
      setPageError("");
      setSuccessMessage("");

      const finalReason =
        reason === "Other" && description.trim()
          ? description.trim()
          : reason.trim();

      await api.put(
`/orders/cancel/${actionOrder._id}`,
{
    customerId: customer._id,
    reason: finalReason
}
);

      closeActionModal();

      setSuccessMessage(
        "Your order has been cancelled successfully."
      );

      await fetchOrders();
    } catch (error) {
      console.error(
        "Cancel order error:",
        error.response?.data || error.message
      );

      setPageError(
        error.response?.data?.message ||
          "The order could not be cancelled."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ====================================================
  // REQUEST RETURN
  // ====================================================

  const submitReturnRequest = async () => {
    if (!actionOrder?._id) {
      return;
    }

    if (!reason.trim()) {
      setPageError(
        "Please select a return reason."
      );
      return;
    }

    try {
      setSubmitting(true);
      setPageError("");
      setSuccessMessage("");

    await api.put(
`/orders/return-request/${actionOrder._id}`,
{
    customerId: customer._id,
    reason: reason,
    description
}
);

      closeActionModal();

      setSuccessMessage(
        "Your return request has been submitted."
      );

      await fetchOrders();
    } catch (error) {
      console.error(
        "Return request error:",
        error.response?.data || error.message
      );

      setPageError(
        error.response?.data?.message ||
          "The return request could not be submitted."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ====================================================
  // TRACKING TIMELINE
  // ====================================================

const getTrackingIcon = (status) => {
  switch (status) {
    case "Pending":
      return <FaClock size={13} />;

    case "Confirmed":
      return <FaClipboardCheck size={13} />;

    case "Processing":
      return <FaCog size={13} />;

    case "Packed":
      return <FaBox size={13} />;

    case "Shipped":
      return <FaTruck size={13} />;

    case "Out for Delivery":
      return <FaShippingFast size={13} />;

    case "Delivered":
      return <FaCheck size={13} />;

    default:
      return <FaClock size={13} />;
  }
};

const copyTrackingNumber = async (trackingNumber) => {
  if (!trackingNumber) return;

  try {
    await navigator.clipboard.writeText(trackingNumber);
    alert("Tracking ID copied.");
  } catch {
    alert("Unable to copy Tracking ID.");
  }
};

const getCourierLogo = (courier) => {
  if (!courier) {
    return null;
  }

  const name = courier.toLowerCase();

  if (name.includes("delhivery"))
    return "https://upload.wikimedia.org/wikipedia/commons/8/89/Delhivery_logo.png";

  if (name.includes("bluedart"))
    return "https://upload.wikimedia.org/wikipedia/commons/7/72/Blue_Dart_logo.svg";

  if (name.includes("dtdc"))
    return "https://upload.wikimedia.org/wikipedia/en/7/75/DTDC_logo.png";

  if (name.includes("ekart"))
    return "https://upload.wikimedia.org/wikipedia/commons/6/6c/Ekart_logo.png";

  return null;
};

  const renderNormalTimeline = (order) => {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-black mb-6">
          Order Tracking
        </h3>

        <div className="relative">
          {NORMAL_ORDER_STEPS.map((step, index) => {
            const completed = isNormalStepCompleted(
              order.orderStatus,
              index
            );

            const active =
              order.orderStatus === step;

            const historyEntry =
              order.statusHistory?.find(
                (history) =>
                  history.status === step
              );

            return (
              <div
                key={step}
                className="relative flex gap-4 pb-8 last:pb-0"
              >
                {index <
                  NORMAL_ORDER_STEPS.length - 1 && (
                  <div
                    className={`absolute left-[17px] top-9 w-[2px] h-full ${
                      completed
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    completed
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  } ${
                    active
                      ? "ring-4 ring-green-100"
                      : ""
                  }`}
                >
                 {completed ? (
  getTrackingIcon(step)
) : (
  <FaClock size={12} />
)}
                </div>

                <div className="pt-1">
                  <p
                    className={`font-bold ${
                      active
                        ? "text-green-700"
                        : completed
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {step}
                  </p>

                  {historyEntry && (
                    <>
                      <p className="text-sm text-gray-500 mt-1">
                        {historyEntry.message}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(historyEntry.date)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderReturnTimeline = (order) => {
    if (
      !order.returnRequested &&
      !RETURN_STEPS.includes(order.orderStatus) &&
      order.orderStatus !== "Return Rejected"
    ) {
      return null;
    }

    return (
      <div className="mt-8 border-t pt-8">
        <h3 className="text-xl font-black mb-6">
          Return Tracking
        </h3>

        {order.orderStatus === "Return Rejected" ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle />

              <h4 className="font-bold">
                Return request rejected
              </h4>
            </div>

            {order.returnAdminNote && (
              <p className="mt-3">
                {order.returnAdminNote}
              </p>
            )}
          </div>
        ) : (
          <div className="relative">
            {RETURN_STEPS.map((step, index) => {
              const completed =
                isReturnStepCompleted(
                  order.orderStatus,
                  index
                );

              const active =
                order.orderStatus === step;

              const historyEntry =
                order.statusHistory?.find(
                  (history) =>
                    history.status === step
                );

              return (
                <div
                  key={step}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >
                  {index <
                    RETURN_STEPS.length - 1 && (
                    <div
                      className={`absolute left-[17px] top-9 w-[2px] h-full ${
                        completed
                          ? "bg-blue-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}

                  <div
                    className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      completed
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    } ${
                      active
                        ? "ring-4 ring-blue-100"
                        : ""
                    }`}
                  >
                    {completed ? (
                      <FaCheck size={13} />
                    ) : (
                      <FaClock size={12} />
                    )}
                  </div>

                  <div className="pt-1">
                    <p
                      className={`font-bold ${
                        active
                          ? "text-blue-700"
                          : completed
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step}
                    </p>

                    {historyEntry && (
                      <>
                        <p className="text-sm text-gray-500 mt-1">
                          {historyEntry.message}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(
                            historyEntry.date
                          )}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ====================================================
  // PAGE UI
  // ====================================================

  return (
    <div className="min-h-screen bg-[#fff7ed] px-4 md:px-8 py-8 md:py-10">
      <div className="max-w-7xl mx-auto">
        {/* PAGE HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-white border rounded-full flex items-center justify-center shadow-sm hover:bg-black hover:text-white transition"
            >
              <FaArrowLeft />
            </button>

            <div>
              <h1 className="text-3xl md:text-5xl font-black">
                Current Orders
              </h1>

              <p className="text-gray-500 mt-2">
                Track, cancel or return your orders.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white border px-4 py-2.5 rounded-xl font-bold hover:bg-black hover:text-white transition disabled:opacity-50"
          >
            <FaRedo
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>
        </div>

        {/* SUCCESS MESSAGE */}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FaCheck />

              <p className="font-semibold">
                {successMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSuccessMessage("")}
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* ERROR MESSAGE */}

        {pageError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle />

              <p className="font-semibold">
                {pageError}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPageError("")}
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="bg-white rounded-3xl p-16 shadow-sm text-center">
            <div className="w-14 h-14 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

            <h2 className="text-2xl font-black mt-5">
              Loading your orders...
            </h2>
          </div>
        ) : orders.length === 0 ? (
          /* EMPTY STATE */

          <div className="bg-white rounded-3xl p-10 md:p-16 shadow-sm text-center">
            <FaBox className="text-6xl text-gray-300 mx-auto" />

            <h2 className="text-2xl md:text-3xl font-black mt-6">
              No current orders
            </h2>

            <p className="text-gray-500 mt-3">
              Your active and return-eligible orders
              will appear here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-7 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* ORDERS */

          <div className="space-y-7">
            {orders.map((order) => {
              const isExpanded =
                expandedOrderId === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl p-5 md:p-7 shadow-sm border"
                >

                  {/* ORDER summary */}

<div className="border rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">

    {/* HEADER */}

    <div className="bg-gradient-to-r from-orange-50 to-white p-3">

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

    {/* PRODUCT */}

    {(order.products || []).map((item,index)=>(

        <div
            key={index}
            className="p-4 border-t flex flex-col lg:flex-row gap-6"
        >

            <img
    src={getProductImage(item)}
    className="w-28 h-28 rounded-xl object-cover bg-gray-100"
/>

            <div className="flex-1">

                <h3 className="text-lg font-bold leading-tight">

                    {item.name}

                </h3>

                <div className="mt-1 text-sm text-gray-500">

                    {item.color || "Default"}

                    •

                    {item.size || "Free Size"}

                    •

                    Qty {item.quantity}

                </div>

                <div className="mt-2 text-sm font-medium text-gray-500">

                    Sold by ISHA STORE

                </div>

                <div className="mt-2 text-2xl font-black">

                    ₹{Number(item.price).toLocaleString("en-IN")}

                </div>


{/* SHIPMENT DETAILS */}

<div className="border-t bg-gray-50 p-0.5">

<h3 className="text-xl font-black mb-5">
Shipment Details
</h3>

<div className="grid md:grid-cols-4 gap-6">

<div>

<p className="text-xs text-gray-500">
Payment
</p>

<p className="font-bold">
{order.paymentStatus}
</p>

</div>

<div>

<p className="text-xs text-gray-500">
Courier
</p>

<p className="font-bold">
{order.courierCompany || "Not Assigned"}
</p>

</div>

<div>

<p className="text-xs text-gray-500">
Tracking ID
</p>

<p className="font-bold">
{order.trackingNumber || "-"}
</p>

</div>

<div>

<p className="text-xs text-gray-500">
Expected Delivery
</p>

<p className="font-bold">

{
order.estimatedDelivery
? formatDate(order.estimatedDelivery)
: "Not Available"
}

</p>

</div>

</div>

</div>

            </div>


        </div>

    ))}

    {/* PROGRESS */}

    <div className="px-6 py-6 border-t bg-gray-50">

        <div className="flex justify-between mb-4">

            {NORMAL_ORDER_STEPS.map((step, index) => {

                const active=index<=getCurrentStepIndex(order.orderStatus);

                return(

                    <div
                        key={step}
                        className="flex flex-col items-center flex-1 relative"
                    >

                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                active
                                    ? "bg-green-600"
                                    : "bg-gray-300"
                            }`}
                        >

                            {active ? <FaCheck/> : index+1}

                        </div>

                        {index !== NORMAL_ORDER_STEPS.length - 1 && (

                            <div
                                className={`absolute top-4 left-1/2 w-full h-1 ${
                                    active
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                }`}
                            />

                        )}

                        <span className="text-xs mt-3 font-semibold text-center">

                            {step}

                        </span>

                    </div>

                )

            })}

        </div>

    </div>

    {/* ACTIONS */}

    <div className="p-4 border-t flex flex-wrap gap-3">

       <button
 type="button"
 onClick={() =>
   setExpandedOrderId(
      isExpanded ? null : order._id
   )
 }
 className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-lg font-bold hover:bg-gray-800 transition"
>
 <FaBox />

 {isExpanded
   ? "Hide Details"
   : "View Details"}
</button>

        <button
            onClick={()=>downloadInvoice(order._id)}
            className="border px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-black hover:text-white"
        >

            <FaFileInvoice/>

            Invoice

        </button>

        {canCancelOrder(order) && (

            <button
                onClick={()=>openActionModal(order,"cancel")}
                className="border border-red-500 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-600 hover:text-white"
            >

                Cancel Order

            </button>

        )}

        {canReturnOrder(order) && (

            <button
                onClick={()=>openActionModal(order,"return")}
                className="border border-orange-500 text-orange-600 px-4 py-2.5 rounded-xl hover:bg-orange-600 hover:text-white"
            >

                Return

            </button>

        )}

    </div>

</div>
                  {/* EXPANDED TRACKING */}

                  {isExpanded && (
<div className="mt-6 space-y-5">
                      {order.courierCompany && (
                        <div className="mb-8 bg-white border rounded-2xl p-5">
                         <div className="flex items-center justify-between mb-5">

  <h3 className="text-xl font-black">
    Shipment Details
  </h3>

  {getCourierLogo(order.courierCompany) && (
    <img
      src={getCourierLogo(order.courierCompany)}
      alt={order.courierCompany}
      className="h-8 object-contain"
    />
  )}

</div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">

                            <div>
                              <span className="font-bold">
                                Courier
                              </span>

                              <p className="text-gray-600">
                                {order.courierCompany}
                              </p>
                            </div>

                            <div>
  <span className="font-bold">
    Tracking ID
  </span>

  <div className="flex items-center gap-3 mt-1">

    <p className="text-gray-700 font-semibold break-all">
      {order.trackingNumber}
    </p>

    <button
      onClick={() =>
        copyTrackingNumber(order.trackingNumber)
      }
      className="text-gray-500 hover:text-black"
      title="Copy Tracking ID"
    >
      <FaCopy />
    </button>

  </div>
</div>

                            <div>
                              <span className="font-bold">
                                Shipped On
                              </span>

                              <p className="text-gray-600">
                                {formatDate(order.shippedAt)}
                              </p>
                            </div>

                            <div>
                              <span className="font-bold">
                                Estimated Delivery
                              </span>

                              <p className="text-gray-600">
                                {formatDate(order.estimatedDelivery)}
                              </p>
                            </div>

                          </div>

                         {order.trackingUrl && (
  <a
    href={order.trackingUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 mt-5 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-800"
  >
    <FaExternalLinkAlt />

    Track on Courier Website
  </a>
)}

                        </div>
                      )}

{/* PRICE DETAILS */}

<div className="border rounded-2xl p-6 bg-white">

  <h3 className="text-xl font-black mb-5">
    Price Details
  </h3>

  <div className="space-y-3">

    <div className="flex justify-between">
      <span className="text-gray-600">
        Subtotal
      </span>

      <span>
        ₹{Number(order.subtotal || order.total).toLocaleString("en-IN")}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-600">
        Discount
      </span>

      <span className="text-green-600">
        - ₹{Number(order.discount || 0).toLocaleString("en-IN")}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-600">
        Coupon Discount
      </span>

      <span className="text-green-600">
        - ₹{Number(order.couponDiscount || 0).toLocaleString("en-IN")}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-600">
        Shipping Charges
      </span>

      <span>
        ₹{Number(order.shippingCharge || 0).toLocaleString("en-IN")}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-600">
        GST
      </span>

      <span>
        ₹{Number(order.tax || 0).toLocaleString("en-IN")}
      </span>
    </div>

    <hr />

    <div className="flex justify-between text-xl font-black">

      <span>Total Amount</span>

      <span>
        ₹{Number(order.total).toLocaleString("en-IN")}
      </span>

    </div>

  </div>

</div>

{/* CUSTOMER DETAILS */}

<div className="border rounded-2xl p-5 bg-gray-50">

<h3 className="text-xl font-black mb-4">
Order Details
</h3>


<div className="grid md:grid-cols-2 gap-4 text-sm">


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
Mobile Number
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


<div>
<p className="text-gray-500">
Payment Status
</p>

<p className="font-bold">
{order.paymentStatus}
</p>
</div>


<div>
  <p className="text-gray-500">
    Address
  </p>

  <p className="font-bold leading-6">
    {order.address ? (
      <>
        {order.address.house}<br />
        {order.address.landmark && (
          <>
            {order.address.landmark}<br />
          </>
        )}
        {order.address.city}, {order.address.state}<br />
        PIN - {order.address.pincode}
      </>
    ) : (
      "Not Available"
    )}
  </p>
</div>


</div>

</div>

<div className="border rounded-2xl p-5">


</div>


                      {renderReturnTimeline(order)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================
          CANCEL / RETURN MODAL
      ================================================== */}

      {actionOrder && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 className="text-2xl md:text-3xl font-black">
                  {actionType === "cancel"
                    ? "Cancel Order"
                    : "Request Return"}
                </h2>

                <p className="text-gray-500 mt-2">
                  Order #
                  {getShortOrderId(
                    actionOrder._id
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={closeActionModal}
                disabled={submitting}
                className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-black hover:text-white disabled:opacity-50"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-7">
              <label className="block font-bold mb-2">
                {actionType === "cancel"
                  ? "Why are you cancelling this order?"
                  : "Why do you want to return this order?"}
              </label>

              <select
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-black"
              >
                <option value="">
                  Select a reason
                </option>

                {(actionType === "cancel"
                  ? CANCELLATION_REASONS
                  : RETURN_REASONS
                ).map((reasonOption) => (
                  <option
                    key={reasonOption}
                    value={reasonOption}
                  >
                    {reasonOption}
                  </option>
                ))}
              </select>
            </div>

            {(actionType === "return" ||
              reason === "Other") && (
              <div className="mt-5">
                <label className="block font-bold mb-2">
                  {actionType === "return"
                    ? "Additional details"
                    : "Please explain your reason"}
                </label>

                <textarea
                  rows="5"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder={
                    actionType === "return"
                      ? "Describe the problem with the product..."
                      : "Write your cancellation reason..."
                  }
                  className="w-full border rounded-xl px-4 py-3 outline-none resize-none focus:border-black"
                />
              </div>
            )}

            {actionType === "cancel" && (
              <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
                Once cancelled, this order cannot be
                reactivated.
              </div>
            )}

            {actionType === "return" && (
              <div className="mt-5 bg-orange-50 border border-orange-200 text-orange-700 rounded-2xl p-4">
                The admin will review your request before
                approving or rejecting the return.
              </div>
            )}

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={closeActionModal}
                disabled={submitting}
                className="flex-1 border px-4 py-2.5 rounded-xl font-bold hover:bg-gray-100 disabled:opacity-50"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={
                  actionType === "cancel"
                    ? submitCancellation
                    : submitReturnRequest
                }
                disabled={
                  submitting || !reason.trim()
                }
                className={`flex-1 text-white px-4 py-2.5 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed ${
                  actionType === "cancel"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {submitting
                  ? "Submitting..."
                  : actionType === "cancel"
                  ? "Confirm Cancellation"
                  : "Submit Return Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}