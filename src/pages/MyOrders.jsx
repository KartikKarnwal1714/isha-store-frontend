import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import { API_URL } from "../utils/apiUrl";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const customer =
    JSON.parse(localStorage.getItem("customer")) || null;


  const fetchMyOrders = async () => {
    if (!customer?._id) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/orders/my-orders/${customer._id}`
      );

      setOrders(res.data.orders || []);
    } catch (error) {
      console.log(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMyOrders();
  }, []);

  if (!customer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff7ed]">
        <h1 className="text-4xl font-black mb-5">
          Please login to view your orders
        </h1>

        <Link
          to="/login"
          className="bg-[#7c3aed] text-white px-8 py-4 rounded-2xl"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7ed]">
      <Navbar variant="page" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-black mb-3">
          My Orders
        </h1>

        <p className="text-gray-500 mb-10">
          Orders placed using {customer.phone}
        </p>

        {loading ? (
          <h2 className="text-3xl font-bold">
            Loading orders...
          </h2>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow">
            <h2 className="text-3xl font-bold">
              No orders found
            </h2>

            <Link
              to="/"
              className="inline-block mt-6 bg-[#7c3aed] text-white px-8 py-4 rounded-2xl"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-[35px] border border-orange-100 p-6 shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">
                  <div>
                    <h2 className="text-2xl font-black">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-black">
                      ₹{Number(order.total).toFixed(2)}
                    </p>

                    <span className="inline-block mt-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {order.products.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border rounded-2xl p-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />

                      <div className="flex-1">
                        <h3 className="font-bold text-lg">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Size: {item.size} | Color: {item.color}
                        </p>

                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold">
                        ₹{item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}