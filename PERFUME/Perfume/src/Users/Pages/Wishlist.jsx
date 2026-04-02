import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../Context/ContextPro";
import { CartContext } from "../Context/cartContext";
import { useNavigate } from "react-router-dom";
import LuxuryProductCard from "../Common/LuxuryProductCard";

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
  const { wishlist, fetchWishlist, removeFromWishlist, isLoggedIn, triggerNotification } = useContext(AppContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isLoggedIn) {
      fetchWishlist().catch(() => {});
    }
  }, [isLoggedIn, fetchWishlist]);

  const onAddToCart = async (product) => {
    if (!isLoggedIn) {
      triggerNotification && triggerNotification("Please login first to add items to cart.", "error");
      navigate("/login");
      return;
    }
    await addToCart(product.id, 1);
    triggerNotification && triggerNotification(`Added ${product.name} to cart 🛒`, "success");
  };

  const onRemoveFromWishlist = async (product) => {
    if (!product || !product.id) return;
    await removeFromWishlist(product.id);
  };

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {wishlist.map((item, idx) => {
              // The API usually wraps the product inside item.product or item.products depending on backend.
              const productObj = item.product || item.products;
              if (!productObj) return null;
              
              const p = {
                ...productObj,
                id: productObj.id || item.productId // Ensure ID maps for onRemove and onAdd
              };

              return (
                <Reveal key={item.id || idx} direction="up" delay={(idx % 4) * 100}>
                  <LuxuryProductCard 
                    product={p} 
                    navigate={navigate}
                    onAddToCart={onAddToCart}
                    onRemoveFromWishlist={onRemoveFromWishlist}
                    isWishlistItem={true}
                  />
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;