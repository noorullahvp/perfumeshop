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
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #44403c; border-radius: 20px; }
        .fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="max-w-7xl mx-auto fade-in-up">
        <h2 className="text-4xl md:text-5xl font-serif text-center text-stone-900 mb-10 tracking-tight">
          Complete Your Order
        </h2>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
            {/* Delivery Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-100 transition-all hover:shadow-md duration-300">
              <h3 className="text-2xl font-serif mb-6 text-stone-800 border-b border-stone-100 pb-4 flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-sans font-semibold text-stone-600">1</span>
                Shipping Address
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-600 mb-1.5 ml-1">Full Name</label>
                  <input
                    name="dlvrAdrsName"
                    type="text"
                    placeholder="e.g. Jane Doe"
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-600 focus:border-stone-600 transition-all outline-none text-stone-800 placeholder-stone-400"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-600 mb-1.5 ml-1">Street Address</label>
                  <input
                    name="dlvrAdrs"
                    type="text"
                    placeholder="123 Perfume Avenue"
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-600 focus:border-stone-600 transition-all outline-none text-stone-800 placeholder-stone-400"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-600 mb-1.5 ml-1">Apartment, suite, etc. (optional)</label>
                  <input
                    name="dlvrAdrs2"
                    type="text"
                    placeholder="Apt 4B"
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-600 focus:border-stone-600 transition-all outline-none text-stone-800 placeholder-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1.5 ml-1">City</label>
                  <input
                    name="dlvrAdrsCity"
                    type="text"
                    placeholder="Mumbai"
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-600 focus:border-stone-600 transition-all outline-none text-stone-800 placeholder-stone-400"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1.5 ml-1">State</label>
                  <input
                    name="dlvrAdrsState"
                    type="text"
                    placeholder="Maharashtra"
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-600 focus:border-stone-600 transition-all outline-none text-stone-800 placeholder-stone-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1.5 ml-1">Postal Code</label>
                  <input
                    name="dlvrAdrsZpCode"
                    type="text"
                    placeholder="400001"
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-600 focus:border-stone-600 transition-all outline-none text-stone-800 placeholder-stone-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1.5 ml-1">Phone Number</label>
                  <input
                    name="dlvrAdrsPhone"
                    type="tel"
                    placeholder="+91 9876543210"
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-600 focus:border-stone-600 transition-all outline-none text-stone-800 placeholder-stone-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-100 transition-all hover:shadow-md duration-300">
              <h3 className="text-2xl font-serif mb-6 text-stone-800 border-b border-stone-100 pb-4 flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-sans font-semibold text-stone-600">2</span>
                Payment Method
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden ${deliveryDetails.paymentMethod === 'CashOnDelivery' ? 'border-stone-800 bg-stone-50/50' : 'border-stone-100 hover:border-stone-300'}`}>
                  {deliveryDetails.paymentMethod === 'CashOnDelivery' && (
                    <div className="absolute top-0 right-0 bg-stone-800 text-stone-50 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-bl-lg">Selected</div>
                  )}
                  <div className="mt-1">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CashOnDelivery"
                      checked={deliveryDetails.paymentMethod === "CashOnDelivery"}
                      onChange={handleChange}
                      className="w-5 h-5 accent-stone-800 shrink-0"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 text-lg">Cash on Delivery</p>
                    <p className="text-stone-500 text-sm mt-1 leading-relaxed">Pay with cash when your order arrives at your doorstep.</p>
                  </div>
                </label>

                <label className={`flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden ${deliveryDetails.paymentMethod === 'OnlinePayment' ? 'border-stone-800 bg-stone-50/50' : 'border-stone-100 hover:border-stone-300'}`}>
                  {deliveryDetails.paymentMethod === 'OnlinePayment' && (
                    <div className="absolute top-0 right-0 bg-stone-800 text-stone-50 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-bl-lg">Selected</div>
                  )}
                  <div className="mt-1">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="OnlinePayment"
                      checked={deliveryDetails.paymentMethod === "OnlinePayment"}
                      onChange={handleChange}
                      className="w-5 h-5 accent-stone-800 shrink-0"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 text-lg">Online Payment</p>
                    <p className="text-stone-500 text-sm mt-1 leading-relaxed">Secure payment via Razorpay. Supports UPI, Cards, and Net Banking.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-stone-900 text-white p-6 md:p-8 rounded-3xl shadow-2xl sticky top-8">
              <h3 className="text-2xl font-serif mb-6 border-b border-stone-800 pb-4">
                Order Summary
              </h3>

              <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-3 custom-scrollbar mb-6">
                {userCartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center group py-2"
                  >
                    <div className="w-16 h-16 rounded-xl bg-stone-800 flex items-center justify-center overflow-hidden shrink-0 border border-stone-700/50">
                      <img
                        src={item.imageUrl || '/placeholder.png'}
                        alt={item.name}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all group-hover:scale-110 duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-100 truncate">{item.name}</p>
                      <p className="text-stone-400 text-sm mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-medium text-stone-50">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-stone-800 space-y-4 text-sm text-stone-300">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-100">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span className="text-stone-100 uppercase text-xs font-bold tracking-wider bg-stone-800 px-2 py-1 rounded">Free</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-stone-800">
                <div className="flex justify-between items-center text-xl font-bold text-white">
                  <span>Total</span>
                  <span className="text-2xl tracking-tight">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-8 bg-white text-stone-900 py-4 px-6 rounded-xl text-[15px] font-bold hover:bg-stone-200 transition-all duration-300 tracking-wider uppercase shadow-lg hover:shadow-xl hover:-translate-y-0.5 outline-none focus:ring-4 focus:ring-stone-500/50 flex justify-center items-center gap-2"
              >
                Place Order
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="mt-6 text-center text-stone-400 text-xs flex items-center justify-center gap-1.5 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Guaranteed safe & secure checkout
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;
