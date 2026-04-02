import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../Context/ContextPro";
import { useNavigate } from "react-router-dom";

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

const Wishlist = () => {
  const { wishlist, fetchWishlist, removeFromWishlist, isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isLoggedIn) {
      fetchWishlist().catch(() => {});
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] bg-[#FDFBF7] flex items-center justify-center p-6">
        <Reveal direction="up" className="text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center mb-8 border border-stone-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-3xl font-serif text-stone-900 mb-4">Please login to view wishlist</h3>
          <p className="text-stone-500 font-light max-w-md text-lg mb-8">
            Access your curated collection of signature fragrances by signing in.
          </p>
          <button 
            onClick={() => navigate("/login")}
            className="bg-stone-900 text-white px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-stone-800 transition-all shadow-xl hover:-translate-y-1"
          >
            Sign In
          </button>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 selection:bg-amber-500/30">
      
      {/* Header Banner */}
      <div className="relative h-[35vh] min-h-[300px] w-full overflow-hidden bg-stone-900 flex items-center justify-center group pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=2000')] bg-cover bg-center opacity-30 mix-blend-luminosity transform scale-105 transition-transform duration-[10s] group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] to-transparent" />
        
        <Reveal direction="up" className="relative z-10 text-center px-4 mt-8 flex flex-col items-center">
          <span className="text-amber-500 tracking-[0.4em] uppercase text-xs md:text-sm mb-4 drop-shadow-md font-bold flex items-center gap-4">
            <span className="w-8 h-[1px] bg-amber-500"></span>
            Your Desires
            <span className="w-8 h-[1px] bg-amber-500"></span>
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-6 tracking-wide drop-shadow-2xl">
            Wishlist
          </h1>
        </Reveal>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 py-12 md:py-16">
        {(!wishlist || wishlist.length === 0) ? (
          <Reveal direction="up" className="text-center py-20 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center mb-8 border border-stone-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-serif text-stone-900 mb-4">Your wishlist is empty</h3>
            <p className="text-stone-500 font-light max-w-md text-lg mb-8">
              Explore our collection and find the perfect scent to add to your desires.
            </p>
            <button 
              onClick={() => navigate("/products")}
              className="bg-stone-900 text-white px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-stone-800 transition-all shadow-xl hover:-translate-y-1"
            >
              Explore Collection
            </button>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12 pl-0">
            {wishlist.map((item, idx) => (
              <Reveal key={item.id} direction="up" delay={(idx % 4) * 100}>
                <div className="group relative flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100 hover:-translate-y-2">
                  
                  {/* Remove Button (Corner) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item.productId);
                    }}
                    className="absolute top-4 right-4 text-stone-300 hover:text-rose-500 transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Product Image */}
                  <div 
                    className="w-full h-64 mb-6 relative overflow-hidden rounded-xl bg-stone-50 cursor-pointer flex items-center justify-center"
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    <img
                      src={
                        item.product?.imageUrls && item.product.imageUrls.length > 0
                          ? item.product.imageUrls[0]
                          : "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                      }
                      alt={item.product?.name || item.products?.name || "Product"}
                      className="max-h-full max-w-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Product Details */}
                  <span className="text-[10px] text-amber-600 uppercase tracking-[0.2em] font-bold mb-2">Eau De Parfum</span>
                  <h3 
                    className="text-xl font-serif text-stone-900 mb-2 cursor-pointer hover:text-amber-600 transition-colors line-clamp-1"
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    {item.product?.name || item.products?.name}
                  </h3>
                  <p className="text-lg font-light text-stone-500 mb-6">₹{(item.product?.price || 0).toLocaleString()}</p>  

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/product/${item.productId}`)}
                    className="w-full bg-transparent border border-stone-900 text-stone-900 px-6 py-3 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-stone-900 hover:text-white transition-all duration-300"
                  >
                    View Details
                  </button>

                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;