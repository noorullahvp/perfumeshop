import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ContextPro, { AppContext } from "../Context/ContextPro";
import { CartContext } from "../Context/cartContext";
import axios from "axios";

// Reusable Product Card Component
const LuxuryProductCard = ({ product, navigate, onAddToCart, onAddToWishlist }) => (
  <div className="group relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 bg-neutral-900 border border-neutral-800">
    
    {/* Product Image */}
    <div className="absolute inset-0 w-full h-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110">
      <img
        src={product.imageUrls?.[0] || "https://via.placeholder.com/400x500?text=No+Image"}
        alt={product.name}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
      />
    </div>

    {/* Elegant Overlays */}
    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent z-10 pointer-events-none transition-all duration-700 group-hover:h-full" />
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 backdrop-blur-[2px] pointer-events-none" />

    {/* Price Tag (Top Left) */}
    <div className="absolute top-5 left-5 z-20 flex items-center justify-center transform transition-transform duration-500 group-hover:-translate-y-1">
      <div className="px-4 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
        <span className="text-amber-400 font-medium tracking-[0.1em] text-sm">
          ₹{product.price?.toLocaleString()}
        </span>
      </div>
    </div>

    {/* Wishlist Floating Action (Top Right) */}
    <button 
      onClick={(e) => { e.stopPropagation(); onAddToWishlist(product); }}
      className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-rose-500 hover:bg-neutral-900 transition-all duration-300 transform hover:scale-110 hover:border-rose-500/50 shadow-lg group-hover:-translate-y-1"
      title="Add to Wishlist"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>

    <div 
      className="absolute inset-0 z-20 cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    />

    {/* Content Reveal Container */}
    <div className="absolute inset-x-0 bottom-0 z-30 p-6 md:p-8 flex flex-col justify-end text-left pointer-events-none">
      
      {/* Resting Info */}
      <div className="transform transition-transform duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-4">
        <p className="text-amber-500/90 text-xs font-bold tracking-[0.3em] uppercase mb-3 drop-shadow-md">
          {product.category || "Signature Scent"}
        </p>
        <h4 className="text-2xl sm:text-3xl font-serif text-white leading-tight drop-shadow-xl line-clamp-2 pr-2 transition-colors duration-300 group-hover:text-amber-50">
          {product.name}
        </h4>
      </div>

      {/* Hidden Info */}
      <div className="grid overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] grid-rows-[0fr] group-hover:grid-rows-[1fr]">
        <div className="min-h-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex flex-col">
          <p className="text-neutral-300/90 text-sm mt-4 line-clamp-3 font-light leading-relaxed drop-shadow-md">
            {product.description}
          </p>
          
          <div className="mt-6 flex gap-3 pointer-events-auto w-full">
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
              className="flex-[0.4] bg-white/10 hover:bg-white text-white hover:text-stone-900 border border-white/20 hover:border-white backdrop-blur-sm py-3.5 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300"
            >
              View
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="flex-[0.6] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-900 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] py-3.5 rounded-xl text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 overflow-hidden relative"
            >
              <div className="absolute inset-0 -translate-x-full hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-12"></div>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      
    </div>
  </div>
);

// Hero Section Component
const HeroSection = ({ navigate }) => {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop",
      title: "Elegance Captured",
      subtitle: "Discover Your Signature Scent"
    },
    {
      url: "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?q=80&w=2000&auto=format&fit=crop",
      title: "Pure Luxury",
      subtitle: "The Art of Perfumery"
    },
    {
      url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2000&auto=format&fit=crop",
      title: "Timeless Classics",
      subtitle: "Find The Perfect Gift"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-stone-900">
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transform transition-transform duration-[8000ms] ease-out"
            style={{ 
              backgroundImage: `url(${img.url})`,
              transform: idx === currentIndex ? "scale(1)" : "scale(1.1)"
            }} 
          />
          {/* Premium Dark Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
              <div className={`max-w-2xl transform transition-all duration-1000 delay-300 ${idx === currentIndex ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
                <span className="text-white/70 font-medium tracking-[0.3em] uppercase text-xs md:text-sm mb-6 block drop-shadow-md">
                  {img.subtitle}
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-[1.1] drop-shadow-xl">
                  {img.title}
                </h1>
                <p className="text-stone-200 text-lg md:text-xl mb-10 font-light max-w-lg leading-relaxed drop-shadow-md">
                  Explore our curated collection of luxury fragrances designed to leave a lasting impression on every moment.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => navigate("/products")}
                    className="bg-white text-stone-900 px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-stone-200 transition-all duration-300 shadow-xl"
                  >
                    Shop Collection
                  </button>
                  <button 
                    onClick={() => navigate("/products")} // Navigate to products as well instead of about, or handle accordingly
                    className="border border-white/30 bg-black/20 text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                  >
                    Best Sellers
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Refined Slider Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-500 rounded-full h-[2px] ${
              idx === currentIndex ? "w-12 bg-white" : "w-6 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};


const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, triggerNotification, addToWishlist } = useContext(AppContext);
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem("user");

    if (saved) {
      const u = JSON.parse(saved);
      if (u.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
        return;
      }
    }

   const load = async () => {
  try {
    // നേരിട്ട് ലിങ്ക് നൽകി പരീക്ഷിക്കുക
    const azureURL = "https://perfumeshop-api-noorullah-cydkgsazbdeuf5f2.southindia-01.azurewebsites.net/api";
    const res = await axios.get(`${azureURL}/Product`);
    
    console.log("Data from Azure:", res.data); // ഡാറ്റ വരുന്നുണ്ടോ എന്ന് നോക്കാൻ
    setProducts(res.data?.data || res.data || []);
  } catch (err) {
    console.error("❌ Product load error:", err);
  } finally {
    setIsLoading(false);
  }
};

  const toAddToCart = async (product) => {
    if (!isLoggedIn) {
      triggerNotification("Please login first to add items to cart.", "error");
      return navigate("/login");
    }

    await addToCart(product.id, 1);
    triggerNotification(`Added ${product.name} to cart 🛒`, "success");
  };

  const onAddToWishlist = async (product) => {
    if (!isLoggedIn) {
      triggerNotification("Please login to manage wishlist.", "error");
      navigate("/login");
      return;
    }
    await addToWishlist(product.id);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 selection:bg-stone-200">
      
      <HeroSection navigate={navigate} />

      {/* Featured Brands / Typography Marquee */}
      <div className="bg-white border-b border-stone-200 py-10 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none w-full" />
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-10 opacity-40 hover:opacity-80 transition-opacity duration-700 w-full px-10">
             <h4 className="font-serif text-xl md:text-2xl tracking-[0.2em] text-stone-800 uppercase">Chanel</h4>
             <h4 className="font-serif text-xl md:text-2xl tracking-[0.2em] text-stone-800 uppercase">Dior</h4>
             <h4 className="font-serif text-xl md:text-2xl tracking-[0.2em] text-stone-800 uppercase">Tom Ford</h4>
             <h4 className="font-serif text-xl md:text-2xl tracking-[0.2em] text-stone-800 uppercase">Gucci</h4>
             <h4 className="font-serif text-xl md:text-2xl tracking-[0.2em] text-stone-800 uppercase hidden md:block">Jo Malone</h4>
        </div>
      </div>

      {/* Main Collection Section */}
      <section className="py-24 px-6 md:px-12 max-w-[90rem] mx-auto">
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="text-stone-500 font-semibold tracking-[0.25em] uppercase text-xs mb-4">
            Handpicked For You
          </span>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 mb-8">
            The Exclusive Collection
          </h3>
          <div className="w-16 h-[1px] bg-stone-400 mb-8"></div>
          <p className="max-w-2xl text-stone-500 text-lg font-light leading-relaxed">
            Immerse yourself in a world of intoxicating aromas, crafted by master perfumers to elevate your everyday presence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {isLoading
            ? [...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-neutral-900 rounded-[2rem] aspect-[3/4] sm:aspect-[4/5] p-6 md:p-8 border border-neutral-800 flex flex-col justify-end relative shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="relative z-10 w-full flex flex-col gap-4">
                    <div className="h-3 bg-neutral-800 rounded w-1/3 mb-1"></div>
                    <div className="h-6 md:h-8 bg-neutral-800 rounded w-3/4 mb-2"></div>
                  </div>
                </div>
              ))
            : products.slice(0, 8).map((product) => (
                <LuxuryProductCard 
                   key={product.id} 
                   product={product} 
                   navigate={navigate}
                   onAddToCart={toAddToCart}
                   onAddToWishlist={onAddToWishlist}
                />
              ))}
        </div>
        
        {!isLoading && products.length > 0 && (
          <div className="mt-24 text-center">
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-4 bg-transparent border border-stone-900 text-stone-900 px-10 py-4 hover:bg-stone-900 hover:text-white transition-all duration-300 text-xs tracking-[0.2em] uppercase font-bold group"
            >
              View All Fragrances
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}
      </section>
      
      {/* Rich Promotional Banner */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden my-12 mx-4 md:mx-12 rounded-[2rem]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px]" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-white/80 font-medium tracking-[0.3em] uppercase text-xs mb-6 text-shadow-md">
            The Perfect Present
          </span>
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-[1.1] text-shadow-lg">
            The Art of Gifting
          </h2>
          <p className="text-stone-100 text-lg md:text-xl mb-12 font-light max-w-2xl leading-relaxed text-shadow-sm">
            Give the gift of an unforgettable scent. Explore our elegantly packaged gift sets, perfect for any occasion and bound to mesmerize.
          </p>
          <button 
            onClick={() => navigate("/products")}
            className="bg-white text-stone-900 px-10 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-stone-200 transition-all duration-300 shadow-xl w-fit"
          >
            Explore Gifts
          </button>
        </div>
      </section>
      
      {/* Benefits section */}
      <section className="py-20 bg-stone-900 text-stone-300">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-stone-700">
          <div className="flex flex-col items-center pt-8 md:pt-0 pb-8 md:pb-0 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <h4 className="text-white font-serif text-xl mb-3">Free Shipping</h4>
            <p className="font-light text-sm max-w-xs leading-relaxed">Enjoy complimentary standard shipping on all orders above ₹2000.</p>
          </div>
          <div className="flex flex-col items-center pt-8 md:pt-0 pb-8 md:pb-0 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <h4 className="text-white font-serif text-xl mb-3">Complimentary Samples</h4>
            <p className="font-light text-sm max-w-xs leading-relaxed">Receive 3 complimentary samples of your choice with every fragrance purchase.</p>
          </div>
          <div className="flex flex-col items-center pt-8 md:pt-0 pb-8 md:pb-0 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h4 className="text-white font-serif text-xl mb-3">Authenticity Guaranteed</h4>
            <p className="font-light text-sm max-w-xs leading-relaxed">We guarantee 100% authenticity on all our luxury fragrances.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

