import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../Users/Context/ContextPro";
import api from "../service/api";
import { GetAdminDashboardStats } from "../service/AdminDashboardService";

const AdminDashboard = () => {
  const { adminLogout } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProductsPurchased: 0,
    deliveredOrdersCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, userRes, dashboardStats] = await Promise.all([
          api.get("/Product"), 
          api.get("/User"), 
          GetAdminDashboardStats(),
        ]);

       
        setProducts(productRes.data.data || []);
        setUsers(userRes.data.data || []);
        setStats(dashboardStats);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const activeProducts = products.filter((p) => p.isActive);
  const activeUsers = users.filter(
    (u) => u.isBlocked == false && u.role === "user"
  );
  const blockedUsers = users.filter(
    (u) => u.isBlocked == true && u.role === "user"
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading dashboard...
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-8 text-indigo-400">
            Admin Panel
          </h2>

          <nav>
            <ul>
              <li className="mb-4">
                <Link
                  to="/admin-dashboard"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <span className="mr-3 text-xl">📊</span> Dashboard
                </Link>
              </li>

              <li className="mb-4">
                <Link
                  to="/admin/product"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <span className="mr-3 text-xl">📦</span> Product Management
                </Link>
              </li>

              <li className="mb-4">
                <Link
                  to="/admin/users"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <span className="mr-3 text-xl">👥</span> User Management
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/admin/manageorders"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <span className="mr-3 text-xl">🚚</span> Order Management
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <button
          onClick={adminLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Logout
        </button>
      </aside>

      
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">
                Total Products
              </h3>
              <p className="text-4xl font-bold text-indigo-600">
                {products.length}
              </p>
            </div>
            <span className="text-5xl text-gray-400">📦</span>
          </div>

          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">
                Active Products
              </h3>
              <p className="text-4xl font-bold text-green-600">
                {activeProducts.length}
              </p>
            </div>
            <span className="text-5xl text-gray-400">✅</span>
          </div>

          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">
                Total Users
              </h3>
              <p className="text-4xl font-bold text-blue-600">{users.length}</p>
            </div>
            <span className="text-5xl text-gray-400">👥</span>
          </div>

          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">
                Active Users
              </h3>
              <p className="text-4xl font-bold text-teal-600">
                {activeUsers.length}
              </p>
            </div>
            <span className="text-5xl text-gray-400">👤</span>
          </div>

          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">
                Blocked Users
              </h3>
              <p className="text-4xl font-bold text-red-600">
                {blockedUsers.length}
              </p>
            </div>
            <span className="text-5xl text-gray-400">🚫</span>
          </div>

          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">
                Total Revenue
              </h3>
              <p className="text-4xl font-bold text-purple-600">
                ₹{stats.totalRevenue}
              </p>
            </div>
            <span className="text-5xl text-gray-400">💰</span>
          </div>

          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">
                Products Purchased
              </h3>
              <p className="text-4xl font-bold text-orange-600">
                {stats.totalProductsPurchased}
              </p>
            </div>
            <span className="text-5xl text-gray-400">🛒</span>
          </div>

          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">
                Delivered Orders
              </h3>
              <p className="text-4xl font-bold text-green-600">
                {stats.deliveredOrdersCount}
              </p>
            </div>
            <span className="text-5xl text-gray-400">📦</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
