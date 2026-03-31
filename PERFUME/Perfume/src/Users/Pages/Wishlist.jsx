import React, { useContext, useEffect } from "react";
import { AppContext } from "../Context/ContextPro";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, fetchWishlist, removeFromWishlist, isLoggedIn } =
    useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist().catch(() => {});
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="p-6 text-center text-gray-700">
        Please login to view wishlist.
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="p-6 text-center text-gray-700">
        Your wishlist is empty.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">My Wishlist</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 shadow text-center flex flex-col items-center"
          >
   <img
  src={
    item.product?.imageUrls && item.product.imageUrls.length > 0
      ? item.product.imageUrls[0]
      : "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
  alt={item.product?.name || "Product"}
  className="w-full h-48 object-cover rounded-md mb-4"
/>


            <h3 className="mt-2 font-semibold">{item.products?.name}</h3>
            <p className="text-gray-600">₹{item.product?.price}</p>  

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => navigate(`/product/${item.productId}`)}
                className="bg-purple-600 text-white py-1 px-3 rounded-md"
              >
                View
              </button>

              <button
                onClick={() => removeFromWishlist(item.productId)}
                className="bg-red-500 text-white py-1 px-3 rounded-md"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;    