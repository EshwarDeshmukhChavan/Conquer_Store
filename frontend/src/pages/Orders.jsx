import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import axios from "axios";
import { toast } from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/payment/orders/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
        } else {
          console.error("Invalid response format:", response.data);
          toast.error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error(error.response?.data?.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

      fetchOrders();
  }, [user, token, navigate]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method?.toLowerCase()) {
      case "online":
        return "Online Payment";
      case "cod":
        return "Cash on Delivery";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              Please login to view your orders
            </h2>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">
              No orders found
            </h2>
            <p className="mt-2 text-gray-600">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
          {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                        Order #{order._id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {getPaymentMethodText(order.paymentMethod)}
                  </span>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-4">
                  {order.products.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center space-x-4"
                        >
                      <img
                            src={item.productId?.image}
                            alt={item.productId?.name}
                            className="w-20 h-20 object-cover rounded"
                      />
                          <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                              {item.productId?.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        {item.size && (
                          <p className="text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                              ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                    </div>
                </div>

                  <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-lg font-medium text-gray-900">
                          ₹{order.amount}
                      </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Shipping Address</p>
                        <p className="text-sm text-gray-900">
                          {order.address.street}
                        </p>
                        <p className="text-sm text-gray-900">
                          {order.address.city}, {order.address.state}{" "}
                          {order.address.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 