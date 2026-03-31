import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const user = JSON.parse(savedUser);

     
      if (user.role?.toLowerCase() === "admin") {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    } else {
      setIsAllowed(false);
    }

    setLoading(false);
  }, []);

  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking admin access...
      </div>
    );
  }

  
  if (isAllowed && location.pathname === "/admin-login") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  
  if (!isAllowed) {
    return <Navigate to="/admin-login" replace />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;
