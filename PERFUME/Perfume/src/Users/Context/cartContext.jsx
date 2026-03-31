import { createContext, useEffect, useState } from "react";
import api from "../../service/api";

export const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const fetchCart = async () => {
    if (!localStorage.getItem("token")) return;

    try {
      const res = await api.get("/Cart");
      setCartItems(res.data?.data?.items || []);
    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  };

 
 
  const addToCart = async (productId, quantity = 1) => {
    if (!localStorage.getItem("token")) {
      console.warn("Please login first.");
      return;
    }

    try {
      await api.post("/Cart", {
        productId,
        quantity,
      });
     await window.location.reload();

      await fetchCart();
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await api.delete(`/Cart/${cartId}`);
      await fetchCart();
    } catch (error) {
      console.error("Remove cart error:", error);
    }
  };

  const updateQuantity = async (cartId, quantity) => {
    try {
      await api.put(`/Cart/${cartId}`, { quantity });
      await fetchCart();
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

 
 
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
