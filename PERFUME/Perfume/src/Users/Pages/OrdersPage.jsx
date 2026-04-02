import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../Context/ContextPro";
import { Link } from "react-router-dom";
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

const OrdersPage = () => {
  const { loggedInUser, triggerNotification } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOrders = async () => {
      if (!loggedInUser?.userId) {
        setLoading(false);
        setError("Please log in to view your orders.");
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("/Order");
        const orderList = response.data?.data || [];

        const sorted = orderList.sort(
          (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
        );

        setOrders(sorted);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again.");
        triggerNotification("Failed to load your orders.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [loggedInUser, triggerNotification]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin mb-8"></div>
          <p className="text-xs tracking-[0.3em] uppercase text-stone-500 font-bold animate-pulse">Retrieving Archives</p>
        </div>
      </div>
    );
  }

  // Error/Auth State
  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-serif text-stone-900 mb-6">Restricted Access</h2>
          <p className="text-stone-500 font-light text-lg mb-10">{error}</p>
          <Link to="/login" className="inline-block">
             <button className="bg-stone-900 text-white px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-amber-600 transition-all shadow-xl hover:-translate-y-1">
               Sign In Required
             </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 selection:bg-amber-500/30">
      
      {/* Header */}
      <div className="pt-24 pb-12 px-6 text-center">
        <Reveal direction="down">
          <span className="text-amber-500 tracking-[0.4em] uppercase text-xs font-bold mb-4 block">Personal Archive</span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4">Your Orders</h1>
          <p className="text-stone-500 font-light text-lg max-w-md mx-auto">Track the journey of your signature collections.</p>
        </Reveal>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-24">
        
        {orders.length === 0 ? (
          <Reveal direction="up" delay={200} className="text-center py-20 flex flex-col items-center bg-stone-50 border border-stone-100 rounded-2xl">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-8 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-3xl font-serif text-stone-900 mb-4">No Archives Found</h2>
            <p className="text-stone-500 font-light text-lg mb-8 max-w-sm">
              Your collection history is empty. Begin your olfactory journey today.
            </p>
            <Link to="/products">
              <button className="bg-stone-900 text-white px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-stone-800 transition-all shadow-lg hover:-translate-y-1">
                Explore The Collection
              </button>
            </Link>
          </Reveal>
        ) : (
          <div className="space-y-12">
            {orders.map((order, idx) => (
              <Reveal key={order.id} direction="up" delay={(idx % 5) * 100}>
                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden group hover:shadow-md transition-shadow duration-500">
                  
                  {/* Order Header */}
                  <div className="bg-stone-50/80 p-6 md:p-8 border-b border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <span className="text-stone-400 uppercase tracking-widest text-[10px] font-bold mb-1 block">Order Ref</span>
                      <h3 className="text-xl font-serif text-stone-900">#{order.id}</h3>
                      <p className="text-stone-500 text-sm mt-1">
                        Placed on{" "}
                        {new Date(order.createdOn).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    
                    <div className="flex gap-8 items-center w-full md:w-auto justify-between md:justify-end border-t border-stone-200 md:border-none pt-4 md:pt-0">
                       <div className="text-left md:text-right">
                        <span className="text-stone-400 uppercase tracking-widest text-[10px] font-bold mb-1 block">Total Investment</span>
                        <div className="text-2xl font-serif text-stone-900">
                          ₹{order.totalAmount.toLocaleString()}
                        </div>
                      </div>
                      <div className="hidden md:block w-[1px] h-10 bg-stone-200"></div>
                      <span
                        className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-bold ${
                          order.paymentStatus === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : order.paymentStatus === "Pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                           {order.paymentStatus === "Completed" ? (
                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           ) : (
                             <circle cx="10" cy="10" r="8" />
                           )}
                         </svg>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Order Details Body */}
                  <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-12">
                    
                    {/* Items List */}
                    <div className="lg:w-2/3">
                      <h4 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-6 border-b border-stone-100 pb-2">
                        Purchased Items
                      </h4>
                      <div className="space-y-6">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-6">
                            <div className="w-20 h-24 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-stone-100">
                              <img
                                src={item.imageUrl || "https://via.placeholder.com/150x200?text=No+Image"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-serif text-stone-900 text-lg mb-1">{item.name}</h5>
                              <p className="text-stone-500 text-sm">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-stone-900 font-serif">
                                ₹{(item.quantity * item.price).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="lg:w-1/3">
                       <h4 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-6 border-b border-stone-100 pb-2">
                        Delivery Details
                      </h4>
                      <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 text-sm text-stone-600 leading-relaxed">
                        <p className="font-bold text-stone-900 mb-2">{order.billingName}</p>
                        <p>{order.billingStreet}</p>
                        {order.billingStreet2 && <p>{order.billingStreet2}</p>}
                        <p>
                          {order.billingCity}, {order.billingState} {order.billingZip}
                        </p>
                        <div className="mt-4 pt-4 border-t border-stone-200 flex items-center text-stone-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {order.billingPhone}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
