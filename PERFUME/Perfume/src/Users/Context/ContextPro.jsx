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

      {/* Luxury Global Notification System */}
      <div 
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-center pointer-events-none ${
          showNotification ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-md border border-stone-200 px-6 py-4 rounded-full shadow-2xl shadow-stone-900/10 flex items-center gap-4 min-w-[300px]">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
             notificationType === "success" ? "bg-amber-500 border-amber-500 text-stone-900 shadow-[0_0_15px_rgba(245,158,11,0.5)]" :
             notificationType === "error" ? "bg-rose-50 border-rose-200 text-rose-600" :
             "bg-stone-50 border-stone-200 text-stone-600"
          }`}>
             {notificationType === "success" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
             )}
             {notificationType === "error" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
             )}
             {notificationType !== "success" && notificationType !== "error" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             )}
          </div>
          <p className="font-serif text-stone-900 font-medium tracking-wide">
             {notificationMessage}
          </p>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default ContextPro;
