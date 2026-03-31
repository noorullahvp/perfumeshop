import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/ContextPro";
import { CartContext } from "../Context/cartContext";
import api from "../../service/api";

const Checkout = () => {
  const navigate = useNavigate();

  const { cartItems, fetchCart } = useContext(CartContext);
  const { loggedInUser, triggerNotification } = useContext(AppContext);

  const [deliveryDetails, setDeliveryDetails] = useState({
    dlvrAdrsName: "",
    dlvrAdrs: "",
    dlvrAdrs2: "",
    dlvrAdrsCity: "",
    dlvrAdrsState: "",
    dlvrAdrsZpCode: "",
    dlvrAdrsPhone: "",
    paymentMethod: "CashOnDelivery",
  });

  const userCartItems = cartItems;

  const totalPrice = userCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  
  useEffect(() => {
    if (!loggedInUser) {
      navigate("/cart");
    }
  }, [loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));
  };

  
  const startRazorpayPayment = async () => {
    try {
      const orderResponse = await api.post("/Payment/create-order", {
        amount: totalPrice,
        billingName: deliveryDetails.dlvrAdrsName,
        billingPhone: deliveryDetails.dlvrAdrsPhone,
        billingStreet: deliveryDetails.dlvrAdrs,
        billingStreet2: deliveryDetails.dlvrAdrs2,
        billingCity: deliveryDetails.dlvrAdrsCity,
        billingState: deliveryDetails.dlvrAdrsState,
        billingZip: deliveryDetails.dlvrAdrsZpCode,
        billingCountry: "India",
      });

      const orderData = orderResponse.data.data;

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "Perfume Shop",
        description: "Order Payment",
        order_id: orderData.orderId,

        handler: async function (response) {
          const verifyPayload = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          };

          const verify = await api.post("/Payment/verify", verifyPayload);

          if (verify.data.statusCode === 200) {
            triggerNotification("Payment Successful!", "success");
            await fetchCart();
            return navigate("/orders");
          } else {
            triggerNotification("Payment verification failed!", "error");
          }
        },

        theme: { color: "#1d9bf0" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error From Backend:", error.response?.data || error);
      triggerNotification("Payment initiation failed", "error");
    }
  };

  
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    const required = [
      "dlvrAdrsName",
      "dlvrAdrs",
      "dlvrAdrsCity",
      "dlvrAdrsState",
      "dlvrAdrsZpCode",
      "dlvrAdrsPhone",
    ];

    const missing = required.find((f) => !deliveryDetails[f]);
    if (missing) {
      triggerNotification("Please fill all required fields.", "error");
      return;
    }

    
    if (deliveryDetails.paymentMethod === "OnlinePayment") {
      return startRazorpayPayment();
    }

   
    const codPayload = {
      billingName: deliveryDetails.dlvrAdrsName,
      billingPhone: deliveryDetails.dlvrAdrsPhone,
      billingStreet: deliveryDetails.dlvrAdrs,
      billingStreet2: deliveryDetails.dlvrAdrs2,
      billingCity: deliveryDetails.dlvrAdrsCity,
      billingState: deliveryDetails.dlvrAdrsState,
      billingZip: deliveryDetails.dlvrAdrsZpCode,
      billingCountry: "India",

      amount: totalPrice,
      paymentMethod: "CashOnDelivery",
    };

    try {
      const res = await api.post("/Order/checkout", codPayload);

      triggerNotification("Order placed successfully!", "success");
      await fetchCart();
      navigate("/orders");
    } catch (error) {
      console.error("Order error:", error);
      triggerNotification("Failed to place order.", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Checkout
      </h2>

      <form onSubmit={handleSubmitOrder}>
        
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">
          Delivery Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input
            name="dlvrAdrsName"
            type="text"
            placeholder="Full Name"
            onChange={handleChange}
            className="p-3 border rounded-lg"
            required
          />
          <input
            name="dlvrAdrs"
            type="text"
            placeholder="Address"
            onChange={handleChange}
            className="p-3 border rounded-lg"
            required
          />
          <input
            name="dlvrAdrs2"
            type="text"
            placeholder="Address Line 2 (Optional)"
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />
          <input
            name="dlvrAdrsCity"
            type="text"
            placeholder="City"
            onChange={handleChange}
            className="p-3 border rounded-lg"
            required
          />
          <input
            name="dlvrAdrsState"
            type="text"
            placeholder="State"
            onChange={handleChange}
            className="p-3 border rounded-lg"
            required
          />
          <input
            name="dlvrAdrsZpCode"
            type="number"
            placeholder="Zip Code"
            onChange={handleChange}
            className="p-3 border rounded-lg"
            required
          />
          <input
            name="dlvrAdrsPhone"
            type="tel"
            placeholder="Phone Number"
            onChange={handleChange}
            className="p-3 border rounded-lg"
            required
          />
        </div>

        
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">
          Payment Method
        </h3>

        <div className="mb-6">
          <label className="flex items-center gap-3 p-3 border rounded-lg mb-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="CashOnDelivery"
              checked={deliveryDetails.paymentMethod === "CashOnDelivery"}
              onChange={handleChange}
            />
            Cash On Delivery
          </label>

          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="OnlinePayment"
              checked={deliveryDetails.paymentMethod === "OnlinePayment"}
              onChange={handleChange}
            />
            Pay Online (Razorpay)
          </label>
        </div>

        {/* Order Items */}
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">
          Your Order Items
        </h3>

        <div className="space-y-4 mb-6">
          {userCartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500 text-sm">₹{item.price}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium">Qty: {item.quantity}</p>
                <p className="font-bold text-green-700">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-xl font-bold mt-6">
          <span>Total Amount:</span>
          <span>₹{totalPrice}</span>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
