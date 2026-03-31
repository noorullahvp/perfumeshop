import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/ContextPro";
import { Link } from "react-router-dom";
import api from "../../service/api";

const OrdersPage = () => {
  const { loggedInUser, triggerNotification } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!loggedInUser?.userId) {
        setLoading(false);
        setError("Please log in to view your orders.");
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("/Order");
        const orderList = response.data?.data || [];

        const sorted = orderList.sort(
          (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
        );

        setOrders(sorted);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again.");
        triggerNotification("Failed to load your orders.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [loggedInUser, triggerNotification]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-purple-600 mx-auto mb-6"></div>
          <p className="text-2xl text-gray-700 font-medium">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-12 rounded-3xl shadow-2xl max-w-md">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
          <Link to="/login">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-8 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Login Now
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-3">
            Your Orders
          </h1>
          <p className="text-gray-600 text-lg">Track and manage your purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-3xl shadow-2xl">
            <div className="text-8xl mb-6">🛍️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 text-lg mb-8">
              Start shopping and your orders will appear here!
            </p>
            <Link to="/products">
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-10 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Explore Products
              </button>
            </Link>
          </div>
        ) : (
          
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h3 className="text-2xl font-bold">Order #{order.id}</h3>
                      <p className="text-purple-100 mt-1">
                        Placed on{" "}
                        {new Date(order.createdOn).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-purple-100">Total Amount</div>
                      <div className="text-3xl font-bold">
                        ₹{order.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  
                  <div className="mb-6">
                    <span
                      className={`inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold ${
                        order.paymentStatus === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span className="mr-2">
                        {order.paymentStatus === "Completed" ? "✓" : "○"}
                      </span>
                      {order.paymentStatus}
                    </span>
                  </div>

                  
                  <div className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2">📍</span>
                      Delivery Address
                    </h4>

                    <div className="text-gray-700 space-y-1 ml-7">
                      <p className="font-semibold">{order.billingName}</p>
                      <p>{order.billingStreet}</p>
                      {order.billingStreet2 && <p>{order.billingStreet2}</p>}
                      <p>
                        {order.billingCity}, {order.billingState} -{" "}
                        {order.billingZip}
                      </p>
                      <p className="flex items-center pt-2">
                        <span className="mr-2">📞</span>
                        {order.billingPhone}
                      </p>
                    </div>
                  </div>

                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <span className="mr-2">📦</span>
                      Order Items ({order.items.length})
                    </h4>

                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl hover:shadow-md transition-shadow duration-200"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg shadow-md"
                          />
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800 text-lg">
                              {item.name}
                            </h5>
                            <p className="text-gray-600">
                              Quantity: {item.quantity} × ₹
                              {item.price.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-purple-700">
                              ₹{(item.quantity * item.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
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

export default OrdersPage;
