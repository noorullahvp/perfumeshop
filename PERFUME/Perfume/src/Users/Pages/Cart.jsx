import React, { useContext } from "react";
import { AppContext } from "../Context/ContextPro";
import { Link } from "react-router-dom";
import api from "../../service/api";

const Cart = () => {
  const { carts, triggerNotification, fetchCartList } = useContext(AppContext);

  const userCartItems = Array.isArray(carts) ? carts : [];

 
  const handleUpdateQuantity = async (item, newQuantity) => {
    try {
      await api.put(`/Cart/${item.id}`, {
        quantity: newQuantity,
      });

      triggerNotification("Cart quantity updated!", "success");
      fetchCartList();
    } catch (error) {
      console.error("Quantity update error:", error);
      triggerNotification("Failed to update quantity.", "error");
    }
  };

  
  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/Cart/${itemId}`);

      triggerNotification("Item removed from cart.", "success");
      fetchCartList();
    } catch (error) {
      console.error("Delete error:", error);
      triggerNotification("Failed to remove item.", "error");
    }
  };

 
  const totalPrice = userCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Your Shopping Cart
      </h2>

      {userCartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 text-xl">Your cart is empty.</p>
          <Link to="/products">
            <button className="mt-4 bg-purple-600 text-white py-2 px-6 rounded-full hover:bg-purple-700 transition">
              Shop Now
            </button>
          </Link>
        </div>
      ) : (
        <div>
          <div className="space-y-4">
            {userCartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg shadow-sm"
              >
                
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <img
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <p className="text-gray-600">₹{item.price}</p>
                  </div>
                </div>

                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? handleUpdateQuantity(item, item.quantity - 1)
                          : handleRemoveItem(item.id)
                      }
                      className="bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-full hover:bg-gray-300"
                    >
                      -
                    </button>

                    <span className="font-semibold w-8 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleUpdateQuantity(item, item.quantity + 1)
                      }
                      className="bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-full hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove Item"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>

         
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>Total Price:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <Link to="/checkout">
              <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
