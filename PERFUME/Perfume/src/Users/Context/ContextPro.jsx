import { createContext, useEffect, useState } from "react";
import api from "../../service/api";

export const AppContext = createContext(null);

const ContextPro = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [carts, setCart] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const triggerNotification = (message, type = "info") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj?.userId) {
          setLoggedInUser(userObj);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("User parse error:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setLoggedInUser(null);
    setIsLoggedIn(false);
    setWishlist([]);
    setCart([]);

    triggerNotification("Logged out successfully!", "success");
    window.location.href = "/login";
  };


  const fetchWishlist = async () => {
    if (!localStorage.getItem("token")) return;

    try {
      const res = await api.get("/Wishlist");
      setWishlist(res.data?.data || []);
    } catch (error) {
      console.error("wishlist fetch error:", error);
    }
  };

  const addToWishlist = async (productId) => {
    if (!localStorage.getItem("token")) {
      triggerNotification("Please login to add to wishlist.", "error");
      return;
    }

    try {
      await api.post(`/Wishlist/${productId}`);
      triggerNotification("Wishlist updated ❤️", "success");
      fetchWishlist();
    } catch {
      triggerNotification("Failed updating wishlist", "error");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.post(`/Wishlist/${productId}`);
      triggerNotification("Removed from wishlist ❌", "success");
      fetchWishlist();
    } catch {
      triggerNotification("Failed to remove wishlist", "error");
    }
  };

  

  const fetchCartList = async () => {
    if (!localStorage.getItem("token")) return;

    try {
      const res = await api.get("/Cart");

     
      setCart(res.data?.data?.items || []);
    } catch (error) {
      console.error("cart fetch error:", error);
    }
  };

  const addToCart = async (productId) => {
    if (!localStorage.getItem("token")) {
      triggerNotification("Please login to add items to the cart.", "error");
      return;
    }

    try {
      await api.post(`/Cart/${productId}`);
      triggerNotification("Added to cart 🛒", "success");
      fetchCartList();
    } catch {
      triggerNotification("Failed updating cart", "error");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.post(`/Cart/${productId}`);
      triggerNotification("Removed from cart ❌", "success");
      fetchCartList();
    } catch {
      triggerNotification("Failed to remove cart", "error");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist();
      fetchCartList();
    } else {
      setWishlist([]);
      setCart([]);
    }
  }, [isLoggedIn]);

  return (
    <AppContext.Provider
      value={{
        products,
        wishlist,
        carts,
        users,
        isLoggedIn,
        setProducts,
        loggedInUser,
        setLoggedInUser,
        setIsLoggedIn,
        setCart,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        triggerNotification,
        handleLogout,
        addToCart,
        fetchCartList,
        removeFromCart,
        setUsers
      }}
    >
      {children}

     
      {showNotification && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-5 py-3 rounded text-white ${
            notificationType === "success"
              ? "bg-green-600"
              : notificationType === "error"
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          {notificationMessage}
        </div>
      )}
    </AppContext.Provider>
  );
};

export default ContextPro;
