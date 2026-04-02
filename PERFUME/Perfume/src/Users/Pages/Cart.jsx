import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../Context/ContextPro";
import { Link, useNavigate } from "react-router-dom";
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

const Cart = () => {
  const { carts, triggerNotification, fetchCartList } = useContext(AppContext);
  const navigate = useNavigate();

  const userCartItems = Array.isArray(carts) ? carts : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleUpdateQuantity = async (item, newQuantity) => {
    try {
      await api.put(`/Cart/${item.id}`, {
        quantity: newQuantity,
      });

      triggerNotification("Cart quantity updated", "success");
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
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 selection:bg-amber-500/30">
      
      {/* Header Banner */}
      <div className="relative h-[35vh] min-h-[300px] w-full overflow-hidden bg-stone-900 flex items-center justify-center group pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=2000')] bg-cover bg-center opacity-30 mix-blend-luminosity transform scale-105 transition-transform duration-[10s] group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] to-transparent" />
        
        <Reveal direction="up" className="relative z-10 text-center px-4 mt-8 flex flex-col items-center">
          <span className="text-amber-500 tracking-[0.4em] uppercase text-xs md:text-sm mb-4 drop-shadow-md font-bold flex items-center gap-4">
            <span className="w-8 h-[1px] bg-amber-500"></span>
            Your Selection
            <span className="w-8 h-[1px] bg-amber-500"></span>
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-6 tracking-wide drop-shadow-2xl">
            Shopping Bag
          </h1>
        </Reveal>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 py-12 md:py-16">
        
        {userCartItems.length === 0 ? (
          <Reveal direction="up" className="text-center py-20 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center mb-8 border border-stone-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-3xl font-serif text-stone-900 mb-4">Your bag is empty</h3>
            <p className="text-stone-500 font-light max-w-md text-lg mb-8">
              Discover our collection of signature fragrances and find your perfect scent.
            </p>
            <button 
              onClick={() => navigate("/products")}
              className="bg-stone-900 text-white px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-stone-800 transition-all shadow-xl hover:-translate-y-1"
            >
              Explore Collection
            </button>
          </Reveal>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* Left: Cart Items List */}
            <div className="lg:w-2/3">
              <Reveal direction="right" delay={100}>
                <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-8">
                  <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">Item</span>
                  <span className="text-xs uppercase tracking-widest text-stone-500 font-bold hidden sm:block">Details</span>
                </div>
              </Reveal>

              <div className="space-y-8">
                {userCartItems.map((item, idx) => (
                  <Reveal key={item.id} direction="up" delay={(idx % 5) * 100}>
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-stone-100 group">
                      
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-40 bg-stone-100 rounded-xl overflow-hidden relative cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>
                        <img
                          src={item.imageUrl || "https://via.placeholder.com/150x200?text=No+Image"}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                        <span className="text-[10px] text-amber-600 uppercase tracking-widest font-bold mb-1">Eau De Parfum</span>
                        <h4 
                          onClick={() => navigate(`/product/${item.productId}`)}
                          className="text-2xl font-serif text-stone-900 mb-2 cursor-pointer hover:text-amber-600 transition-colors"
                        >
                          {item.name}
                        </h4>
                        <p className="text-lg font-light text-stone-500 mb-6 sm:mb-0">₹{item.price?.toLocaleString()}</p>
                      </div>

                      {/* Controls & Actions */}
                      <div className="flex flex-col items-center sm:items-end gap-6 sm:w-32">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-stone-400 hover:text-rose-500 transition-colors uppercase text-[10px] tracking-widest font-bold flex items-center gap-2 group/del"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover/del:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>

                        <div className="flex items-center border border-stone-200 rounded-full px-1 py-1 bg-white">
                          <button
                            onClick={() => item.quantity > 1 ? handleUpdateQuantity(item, item.quantity - 1) : handleRemoveItem(item.id)}
                            className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-50 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-50 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </button>
                        </div>
                      </div>

                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:w-1/3">
              <Reveal direction="left" delay={200} className="sticky top-32">
                <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 shadow-sm">
                  <h3 className="text-xl font-serif text-stone-900 mb-6 border-b border-stone-200 pb-4">Order Summary</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-stone-500 text-sm">
                      <span>Subtotal ({userCartItems.reduce((a,c) => a + c.quantity, 0)} items)</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-stone-500 text-sm">
                      <span>Shipping</span>
                      <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest flex items-center">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-stone-500 text-sm">
                      <span>Gift Packaging</span>
                      <span className="text-amber-600 font-bold uppercase text-[10px] tracking-widest shrink-0">Included</span>
                    </div>
                  </div>

                  <div className="border-t border-stone-200 pt-6 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="text-stone-900 font-bold uppercase text-xs tracking-widest">Estimated Total</span>
                      <span className="text-3xl font-serif text-stone-900">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link to="/checkout" className="block w-full">
                    <button className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-amber-600 transition-all duration-500 flex justify-center items-center group relative overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        Proceed to Secure Checkout
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </button>
                  </Link>

                  <div className="mt-6 flex flex-col gap-3">
                    <p className="text-stone-400 text-[10px] uppercase tracking-widest text-center flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      Secure Encrypted Checkout
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
