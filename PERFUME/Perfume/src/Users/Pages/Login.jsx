import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/ContextPro";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { triggerNotification, isLoggedIn, setIsLoggedIn, setLoggedInUser } =
    useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/Auth/login", { email, password });

      const token = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      if (!token) {
        setMessage("⚠️ Token missing.");
        return;
      }

     
      localStorage.setItem("token", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      
      const decoded = jwtDecode(token);

      const userId =
        decoded.nameid ||
        decoded.sub ||
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      const name =
        decoded.unique_name ||
        decoded.name ||
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ];

      const userEmail = decoded.email;

      const role =
        decoded.role ||
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      
      let backendUser = {};
      try {
        const userRes = await api.get(`/User/${userId}`);
        backendUser = userRes.data?.data || userRes.data || {};
      } catch (err) {
        console.warn("User fetch failed:", err);
      }

      const userObject = {
        userId,
        name,
        email: userEmail,
        role,
        ...backendUser,
      };

     
      localStorage.setItem("user", JSON.stringify(userObject));

      setLoggedInUser(userObject);
      setIsLoggedIn(true);

      triggerNotification("Login successful!", "success");

    
      if (role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (err) {
      if (err.response?.status === 403) {
        setMessage("⚠️ Account blocked by admin.");
      } else if (err.response?.status === 401) {
        setMessage("❌ Invalid email or password.");
      } else {
        setMessage("⚠️ Server error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Login Here</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-center">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-md"
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          Not registered?{" "}
          <a href="/registration" className="text-indigo-600">
            Create an account
          </a>
        </p>
      </div>
    </section>
  );
};

export default Login;
