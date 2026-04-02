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
    if (direction === "up") translateClass = "translate-y-16 opacity-0";
    if (direction === "down") translateClass = "-translate-y-16 opacity-0";
    if (direction === "left") translateClass = "-translate-x-16 opacity-0";
    if (direction === "right") translateClass = "translate-x-16 opacity-0";
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

import LuxuryProductCard from "../Common/LuxuryProductCard";

const Products = () => {
  const navigate = useNavigate();
  const { isLoggedIn, triggerNotification, addToWishlist } = useContext(AppContext);
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive Filtering
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const res = await api.get("/Product");
        const items = res.data?.data || [];
        const activeItems = items.filter((p) => p.isActive);
        setProducts(activeItems);
        
        // Extract unique categories dynamically
        const extractedCategories = [...new Set(activeItems.map(p => p.category).filter(Boolean))];
        setCategories(["All", ...extractedCategories]);
      } catch (error) {
        triggerNotification("Failed to load products", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [triggerNotification]);

  const onAddToWishlist = async (product) => {
    if (!isLoggedIn) {
      triggerNotification("Please login to manage wishlist.", "error");
      navigate("/login");
      return;
    }
    await addToWishlist(product.id);
  };

  const onAddToCart = async (product) => {
    if (!isLoggedIn) {
      triggerNotification("Please login first to add items to cart.", "error");
      navigate("/login");
      return;
    }
    await addToCart(product.id, 1);
    triggerNotification(`Added ${product.name} to cart 🛒`, "success");
  };

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 selection:bg-amber-500/30">
      
      {/* Stunning Parallax Header */}
      <div className="relative h-[45vh] min-h-[400px] w-full overflow-hidden bg-stone-900 flex items-center justify-center group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2000')] bg-cover bg-fixed bg-center opacity-40 mix-blend-luminosity transform scale-105 transition-transform duration-[10s] group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-stone-900/60 to-stone-900/80" />
        
        <Reveal direction="up" className="relative z-10 text-center px-4 mt-12 flex flex-col items-center">
          <span className="text-amber-500 tracking-[0.4em] uppercase text-xs md:text-sm mb-6 drop-shadow-md font-bold flex items-center gap-4">
            <span className="w-8 h-[1px] bg-amber-500"></span>
            Le Catalogue
            <span className="w-8 h-[1px] bg-amber-500"></span>
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif text-white mb-6 tracking-wide drop-shadow-2xl">
            Fine Fragrances
          </h1>
          <p className="text-stone-300 font-light max-w-xl mx-auto text-sm md:text-base">
            Explore our curated selection of signature scents, crafted by master perfumers using the most exquisite ingredients from around the world.
          </p>
        </Reveal>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 py-16 md:py-24">
        
        {/* Interactive Advanced Utilities Bar */}
        <Reveal direction="down" delay={200}>
          <div className="flex flex-col lg:flex-row items-center justify-between mb-16 pb-8 border-b border-stone-200 gap-8">
            <p className="text-stone-500 text-sm font-medium tracking-wider uppercase">
              Showing <span className="text-stone-900 font-bold ml-1">{loading ? "..." : filteredProducts.length}</span> Masterpieces
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-6">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs tracking-[0.15em] uppercase font-bold py-2 px-1 relative transition-colors duration-300 ${
                    activeCategory === cat ? "text-stone-900" : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 animate-[pulse_2s_ease-in-out_infinite]"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-900 rounded-[2rem] aspect-[3/4] sm:aspect-[4/5] p-6 md:p-8 border border-neutral-800 flex flex-col justify-end relative shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="relative z-10 w-full flex flex-col gap-4">
                  <div className="h-3 bg-neutral-800 rounded w-1/3 mb-1"></div>
                  <div className="h-6 md:h-8 bg-neutral-800 rounded w-3/4 mb-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Reveal direction="up" className="text-center py-32 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center mb-8 border border-stone-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-3xl font-serif text-stone-900 mb-4">No Masterpieces Found</h3>
            <p className="text-stone-500 font-light max-w-md text-lg">
              We couldn't find any fragrances matching your criteria. Explore our other collections.
            </p>
            <button 
              onClick={() => setActiveCategory("All")}
              className="mt-8 border-b border-stone-900 text-stone-900 uppercase tracking-widest text-xs font-bold pb-1 hover:text-amber-600 hover:border-amber-600 transition-colors"
            >
              View All Collection
            </button>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {filteredProducts.map((product, idx) => (
              <Reveal key={product.id} direction="up" delay={(idx % 4) * 100}>
                <LuxuryProductCard 
                  product={product} 
                  navigate={navigate}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
