import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/ContextPro";
import { CartContext } from "../Context/cartContext";
import api from "../../service/api";

// --- Animation Hooks & Components ---
const useScrollReveal = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold });
    
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [threshold]);
  
  return [ref, isVisible];
};

const Reveal = ({ children, direction = "up", delay = 0, className = "" }) => {
  const [ref, isVisible] = useScrollReveal();
  const baseClass = "transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]";
  
  let translateClass = "";
  if (!isVisible) {
    if (direction === "up") translateClass = "translate-y-12 opacity-0";
    if (direction === "down") translateClass = "-translate-y-12 opacity-0";
    if (direction === "left") translateClass = "-translate-x-12 opacity-0";
    if (direction === "right") translateClass = "translate-x-12 opacity-0";
    if (direction === "none") translateClass = "scale-95 opacity-0";
  } else {
    translateClass = "translate-y-0 translate-x-0 scale-100 opacity-100";
  }
  
  return (
    <div ref={ref} className={`${baseClass} ${translateClass} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

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
    window.scrollTo(0, 0);
    if (!loggedInUser) {
      navigate("/cart", { replace: true });
    }
  }, [loggedInUser, navigate]);

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
        name: "Lux Perfumes",
        description: "Signature Collection Purchase",
        order_id: orderData.orderId,

        handler: async function (response) {
          const verifyPayload = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          };

          const verify = await api.post("/Payment/verify", verifyPayload);

          if (verify.data.statusCode === 200) {
            triggerNotification("Payment Successful! Welcome to the collection.", "success");
            await fetchCart();
            return navigate("/orders");
          } else {
            triggerNotification("Payment verification failed. Please contact concierge.", "error");
          }
        },
        theme: { color: "#1C1917" }, // stone-900
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error From Backend:", error.response?.data || error);
      triggerNotification("Payment initiation failed. Please try again.", "error");
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
      triggerNotification("Please fill all required delivery fields.", "error");
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
      await api.post("/Order/checkout", codPayload);

      triggerNotification("Order placed successfully! Welcome to the collection.", "success");
      await fetchCart();
      navigate("/orders");
    } catch (error) {
      console.error("Order error:", error);
      triggerNotification("Failed to place order. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 selection:bg-amber-500/30 pb-24">
      
      {/* Header */}
      <div className="pt-24 pb-12 px-6 text-center">
        <Reveal direction="down">
          <span className="text-amber-500 tracking-[0.4em] uppercase text-xs font-bold mb-4 block">Secure Checkout</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">Finalize Order</h1>
        </Reveal>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <form onSubmit={handleSubmitOrder} className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Form Details */}
          <div className="lg:w-7/12 flex flex-col gap-12">
            
            {/* Delivery Section */}
            <Reveal direction="right" delay={100}>
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-stone-100">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-sm">1</span>
                  <h3 className="text-2xl font-serif text-stone-900">Delivery Details</h3>
                </div>
                
                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="relative group">
                    <input
                      name="dlvrAdrsName"
                      type="text"
                      required
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors peer placeholder-transparent"
                      placeholder="Full Name"
                    />
                    <label className="absolute left-0 top-3 text-stone-400 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-stone-900 peer-focus:font-bold peer-focus:tracking-widest uppercase tracking-wide peer-valid:-top-4 peer-valid:text-xs peer-valid:text-stone-900 peer-valid:font-bold peer-valid:tracking-widest pointer-events-none">
                      Full Name
                    </label>
                  </div>
                  
                  {/* Street Address */}
                  <div className="relative group">
                    <input
                      name="dlvrAdrs"
                      type="text"
                      required
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors peer placeholder-transparent"
                      placeholder="Street Address"
                    />
                    <label className="absolute left-0 top-3 text-stone-400 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-stone-900 peer-focus:font-bold peer-focus:tracking-widest uppercase tracking-wide peer-valid:-top-4 peer-valid:text-xs peer-valid:text-stone-900 peer-valid:font-bold peer-valid:tracking-widest pointer-events-none">
                      Street Address
                    </label>
                  </div>

                  {/* Apt/Suite */}
                  <div className="relative group">
                    <input
                      name="dlvrAdrs2"
                      type="text"
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors peer placeholder-transparent"
                      placeholder="Apt/Suite"
                    />
                    <label className="absolute left-0 top-3 text-stone-400 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-stone-900 peer-focus:font-bold peer-focus:tracking-widest uppercase tracking-wide peer-valid:-top-4 peer-valid:text-xs peer-valid:text-stone-900 peer-valid:font-bold peer-valid:tracking-widest pointer-events-none">
                      Apartment, Suite, etc. (optional)
                    </label>
                  </div>

                  {/* Location Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="relative group">
                      <input
                        name="dlvrAdrsCity"
                        type="text"
                        required
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors peer placeholder-transparent"
                        placeholder="City"
                      />
                      <label className="absolute left-0 top-3 text-stone-400 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-stone-900 peer-focus:font-bold peer-focus:tracking-widest uppercase tracking-wide peer-valid:-top-4 peer-valid:text-xs peer-valid:text-stone-900 peer-valid:font-bold peer-valid:tracking-widest pointer-events-none">
                        City
                      </label>
                    </div>
                    <div className="relative group">
                      <input
                        name="dlvrAdrsState"
                        type="text"
                        required
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors peer placeholder-transparent"
                        placeholder="State"
                      />
                      <label className="absolute left-0 top-3 text-stone-400 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-stone-900 peer-focus:font-bold peer-focus:tracking-widest uppercase tracking-wide peer-valid:-top-4 peer-valid:text-xs peer-valid:text-stone-900 peer-valid:font-bold peer-valid:tracking-widest pointer-events-none">
                        State
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="relative group">
                      <input
                        name="dlvrAdrsZpCode"
                        type="text"
                        required
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors peer placeholder-transparent"
                        placeholder="Postal Code"
                      />
                      <label className="absolute left-0 top-3 text-stone-400 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-stone-900 peer-focus:font-bold peer-focus:tracking-widest uppercase tracking-wide peer-valid:-top-4 peer-valid:text-xs peer-valid:text-stone-900 peer-valid:font-bold peer-valid:tracking-widest pointer-events-none">
                        Postal Code
                      </label>
                    </div>
                    <div className="relative group">
                      <input
                        name="dlvrAdrsPhone"
                        type="tel"
                        required
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors peer placeholder-transparent"
                        placeholder="Phone Number"
                      />
                      <label className="absolute left-0 top-3 text-stone-400 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-stone-900 peer-focus:font-bold peer-focus:tracking-widest uppercase tracking-wide peer-valid:-top-4 peer-valid:text-xs peer-valid:text-stone-900 peer-valid:font-bold peer-valid:tracking-widest pointer-events-none">
                        Phone Number
                      </label>
                    </div>
                  </div>

                </div>
              </div>
            </Reveal>

            {/* Payment Section */}
            <Reveal direction="right" delay={200}>
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-stone-100">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-sm">2</span>
                  <h3 className="text-2xl font-serif text-stone-900">Payment Option</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`flex flex-col p-6 rounded-xl cursor-pointer transition-all duration-300 relative border-2 ${deliveryDetails.paymentMethod === 'CashOnDelivery' ? 'border-stone-900 bg-stone-50' : 'border-stone-100 hover:border-stone-300 bg-white'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-stone-900 uppercase text-xs tracking-widest">Pay on Delivery</span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${deliveryDetails.paymentMethod === 'CashOnDelivery' ? 'border-stone-900 bg-stone-900' : 'border-stone-300'}`}>
                        {deliveryDetails.paymentMethod === 'CashOnDelivery' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CashOnDelivery"
                      checked={deliveryDetails.paymentMethod === "CashOnDelivery"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <p className="text-stone-500 text-xs leading-relaxed">Exchange currency for your signature scent upon arrival at your destination.</p>
                  </label>

                  <label className={`flex flex-col p-6 rounded-xl cursor-pointer transition-all duration-300 relative border-2 ${deliveryDetails.paymentMethod === 'OnlinePayment' ? 'border-stone-900 bg-stone-50' : 'border-stone-100 hover:border-stone-300 bg-white'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-stone-900 uppercase text-xs tracking-widest">Secure Online</span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${deliveryDetails.paymentMethod === 'OnlinePayment' ? 'border-stone-900 bg-stone-900' : 'border-stone-300'}`}>
                        {deliveryDetails.paymentMethod === 'OnlinePayment' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="OnlinePayment"
                      checked={deliveryDetails.paymentMethod === "OnlinePayment"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <p className="text-stone-500 text-xs leading-relaxed">Encrypted digital transaction supporting Credit Cards, UPI, and Net Banking.</p>
                  </label>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-5/12">
            <Reveal direction="left" delay={300} className="sticky top-32">
              <div className="bg-stone-900 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-transparent opacity-50 z-0"></div>
                
                <h3 className="text-2xl font-serif text-white mb-6 border-b border-stone-700 pb-4 relative z-10">
                  Your Collection
                </h3>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-8 relative z-10 scrollbar-hide">
                  {userCartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-20 rounded-lg bg-stone-800 overflow-hidden shrink-0 border border-stone-700">
                        <img
                          src={item.imageUrl || '/placeholder.png'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-serif text-stone-100 text-lg">{item.name}</p>
                        <p className="text-stone-400 text-xs uppercase tracking-widest">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-stone-100 font-serif">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-stone-700 space-y-4 text-sm text-stone-300 relative z-10">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-white">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-amber-500 uppercase text-[10px] font-bold tracking-widest">Complimentary</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-stone-700 relative z-10 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-stone-100 font-bold uppercase text-xs tracking-widest">Total Investment</span>
                    <span className="text-3xl font-serif text-white">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-stone-900 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-amber-500 hover:text-white transition-all duration-500 flex justify-center items-center shadow-xl hover:-translate-y-1 relative z-10"
                >
                  <span className="flex items-center gap-2">
                    Complete Transaction
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
                
                <div className="mt-6 text-center text-stone-500 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 relative z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Encrypted Secure Checkout
                </div>
              </div>
            </Reveal>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;
