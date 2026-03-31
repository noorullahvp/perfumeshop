import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../Users/Context/ContextPro";
import { useNavigate } from "react-router-dom";
import api from "../service/api";


const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { isAdminLoggedIn, triggerNotification } = useContext(AppContext);
  const navigate = useNavigate();

 
  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      
      const response = await api.post("/Users/admin-login", {
        email,
        password,
      });

      if (response.status === 200 && response.data) {
        const admin = response.data;

        if (!admin.isActive) {
          setMessage("Your admin account is inactive. Contact super-admin.");
          triggerNotification("Admin account deactivated. Cannot log in.", "error");
          setLoading(false);
          return;
        }

        
        localStorage.setItem("adminLoggedIn", JSON.stringify(admin));
        triggerNotification("Admin login successful!", "success");
        setMessage("Admin login successful! Redirecting...");
        setEmail("");
        setPassword("");

        
        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", function (event) {
          window.history.pushState(null, null, window.location.href);
        });

        navigate("/admin-dashboard", { replace: true });
      } else {
        setMessage("Invalid admin credentials.");
        triggerNotification("Invalid admin credentials.", "error");
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      setMessage("Login failed. Please check credentials or server connection.");
      triggerNotification("Error during login. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out"
              placeholder="Enter admin email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm font-medium ${
                message.includes("successful")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Login as Admin"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
