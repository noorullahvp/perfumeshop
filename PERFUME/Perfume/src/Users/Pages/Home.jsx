import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/ContextPro";
import { CartContext } from "../Context/cartContext";
import axios from "axios";

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
    if (direction === "up") translateClass = "translate-y-24 opacity-0";
    if (direction === "down") translateClass = "-translate-y-24 opacity-0";
    if (direction === "left") translateClass = "-translate-x-24 opacity-0";
    if (direction === "right") translateClass = "translate-x-24 opacity-0";
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

const HeroSection = ({ navigate }) => {
  const images = [
    { url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop", title: "Elegance Captured", subtitle: "Discover Your Signature Scent" },
    { url: "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?q=80&w=2000&auto=format&fit=crop", title: "Pure Luxury", subtitle: "The Art of Perfumery" },
    { url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2000&auto=format&fit=crop", title: "Timeless Classics", subtitle: "Find The Perfect Gift" }
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentIndex((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(timer);
  }, [images.length]);
  
  return (
    <div className="relative h-screen min-h-[700px] w-full overflow-hidden bg-stone-900 group">
      {images.map((img, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-[1500ms] ${idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <div className="absolute inset-0 bg-cover bg-center transform transition-transform duration-[10000ms] ease-out" style={{ backgroundImage: `url(${img.url})`, transform: idx === currentIndex ? "scale(1.05)" : "scale(1.15)" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-stone-900/10" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full text-white">
              <div className={`transform transition-all duration-[1200ms] delay-300 ${idx === currentIndex ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
                <span className="inline-block tracking-[0.3em] uppercase text-xs sm:text-sm mb-6 text-amber-500 border-l-2 border-amber-500 pl-4">
                  {img.subtitle}
                </span>
              </div>
              <div className={`transform transition-all duration-[1200ms] delay-500 ${idx === currentIndex ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-8 leading-[1] drop-shadow-2xl">{img.title}</h1>
              </div>
              <div className={`transform transition-all duration-[1200ms] delay-700 ${idx === currentIndex ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
                <div className="flex gap-6 items-center">
                  <button onClick={() => navigate("/products")} className="relative overflow-hidden group/btn bg-white text-stone-900 px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold transition-all hover:bg-stone-100">
                    <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300">Shop Collection</span>
                    <div className="absolute inset-0 bg-stone-900 w-0 group-hover/btn:w-full transition-all duration-500 ease-out z-0"></div>
                  </button>
                  <button onClick={() => navigate("/products")} className="text-white uppercase tracking-[0.2em] text-xs font-bold border-b border-white/30 pb-1 hover:border-white transition-colors">
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
        <span className="text-white/50 text-[10px] tracking-widest uppercase mb-2">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
      </div>
    </div>
  );
};

const CategoriesSection = ({ navigate }) => {
  const categories = [
    { title: "For Him", bg: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000", desc: "Masculine & Woody" },
    { title: "For Her", bg: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=1000", desc: "Floral & Elegant" },
    { title: "Unisex", bg: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=1000", desc: "Modern & Fresh" }
  ];

  return (
    <section className="py-32 px-6 md:px-12 max-w-[90rem] mx-auto">
      <Reveal direction="down">
        <div className="text-center mb-20">
          <span className="text-amber-500 uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Curated Selection</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900">Shop By Category</h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <Reveal key={idx} direction="up" delay={idx * 150} className="w-full">
            <div 
              onClick={() => navigate("/products")}
              className="group relative h-[60vh] min-h-[400px] w-full overflow-hidden cursor-pointer rounded-2xl"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.bg})` }}
              />
              <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/40 transition-colors duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-black/20 to-transparent" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end items-center text-center">
                <span className="text-amber-400 text-xs tracking-[0.2em] uppercase mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {cat.desc}
                </span>
                <h3 className="text-3xl md:text-4xl font-serif text-white mb-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                  {cat.title}
                </h3>
                <div className="w-0 h-[1px] bg-white group-hover:w-16 transition-all duration-500 ease-out"></div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

const BrandStorySection = () => {
  return (
    <section className="bg-stone-900 text-stone-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=2000')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
      
      <div className="max-w-[90rem] mx-auto px-6 md:px-12 py-32 flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <Reveal direction="right" className="lg:w-1/2 relative">
          <div className="aspect-square max-w-[500px] mx-auto relative group">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-500/30 transition-all duration-1000"></div>
            <img 
              src="https://images.unsplash.com/photo-1595425970377-c9703bc48b4d?q=80&w=1000" 
              alt="Perfumery Art" 
              className="w-full h-full object-cover rounded-t-full relative z-10 shadow-2xl"
            />
            <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-full shadow-2xl z-20 animate-[spin_20s_linear_infinite]">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <path id="curve" fill="transparent" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                <text className="text-[11px] uppercase tracking-widest font-bold fill-stone-900">
                  <textPath href="#curve">The Art of Fine Perfumery • Since 1990 • </textPath>
                </text>
              </svg>
            </div>
          </div>
        </Reveal>
        
        <Reveal direction="left" className="lg:w-1/2 flex flex-col gap-8">
          <span className="text-amber-500 uppercase tracking-[0.3em] text-xs font-bold border-l-2 border-amber-500 pl-4">Our Philosophy</span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white leading-[1.1]">Crafting Memories Through Scent</h2>
          <p className="text-stone-400 font-light leading-relaxed text-lg max-w-xl">
            Every bottle contains a universe of carefully selected notes, sourced from the finest ingredients globally. Our master perfumers blend tradition with modern artistry to create olfactory masterpieces that linger in your memory long after the first spritz.
          </p>
          <div className="flex bg-stone-800/50 backdrop-blur border border-stone-800 p-6 rounded-2xl gap-8 mt-4 max-w-xl">
            <div>
              <h4 className="text-3xl font-serif text-amber-500 mb-1">100+</h4>
              <p className="text-xs text-stone-400 uppercase tracking-widest">Rare Ingredients</p>
            </div>
            <div className="w-[1px] bg-stone-700"></div>
            <div>
              <h4 className="text-3xl font-serif text-amber-500 mb-1">30</h4>
              <p className="text-xs text-stone-400 uppercase tracking-widest">Years Expertise</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const NewsletterSection = () => {
  return (
    <section className="py-40 relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2000')] bg-cover bg-fixed bg-center"></div>
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm"></div>
      
      <Reveal direction="none" className="relative z-10 w-full max-w-2xl px-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500 mx-auto mb-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Join The Inner Circle</h2>
        <p className="text-stone-300 font-light mb-12">Subscribe to discover exclusive launches, personalized gift ideas, and the secrets of high perfumery.</p>
        
        <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Your Email Address" 
            className="flex-1 bg-white/10 border border-white/20 text-white px-6 py-4 rounded-xl focus:outline-none focus:border-amber-500 transition-colors placeholder:text-stone-400"
          />
          <button className="bg-amber-500 text-stone-900 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-amber-400 transition-colors">
            Subscribe
          </button>
        </form>
      </Reveal>
    </section>
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
        const res = await axios.get("https://perfumeshop-api-noorullah-cydkgsazbdeuf5f2.southindia-01.azurewebsites.net/api/Product");
        setProducts(res.data?.data || res.data || []);
      } catch (err) {
        console.error("❌ Product load error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [navigate]);

  const toAddToCart = async (product) => {
    if (!isLoggedIn) {
      triggerNotification("Please login first", "error");
      return navigate("/login");
    }
    await addToCart(product.id, 1);
    triggerNotification(`Added ${product.name} to cart`, "success");
  };

  const onAddToWishlist = async (product) => {
    if (!isLoggedIn) {
      triggerNotification("Please login", "error");
      return navigate("/login");
    }
    await addToWishlist(product.id);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-amber-500/30">
      <HeroSection navigate={navigate} />
      
      <CategoriesSection navigate={navigate} />

      <BrandStorySection />

      <section className="py-32 px-6 md:px-12 max-w-[90rem] mx-auto">
        <Reveal direction="down" className="text-center mb-20 flex flex-col items-center">
          <span className="text-stone-500 uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Signature Series</span>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 text-stone-900">The Exclusive Collection</h3>
          <div className="w-16 h-[1px] bg-stone-300"></div>
        </Reveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {isLoading ? (
             <div className="col-span-full py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-900"></div>
             </div>
          ) : (
            products.slice(0, 8).map((product, idx) => (
              <Reveal key={product.id} direction="up" delay={(idx % 4) * 100}>
                <LuxuryProductCard 
                  product={product} 
                  navigate={navigate} 
                  onAddToCart={toAddToCart} 
                  onAddToWishlist={onAddToWishlist} 
                />
              </Reveal>
            ))
          )}
        </div>
        
        <Reveal direction="up" className="mt-20 text-center">
          <button 
            onClick={() => navigate("/products")}
            className="border border-stone-900 text-stone-900 px-12 py-5 uppercase tracking-[0.2em] text-xs font-bold hover:bg-stone-900 hover:text-white transition-all duration-500"
          >
            View All Fragrances
          </button>
        </Reveal>
      </section>

      <NewsletterSection />
    </div>
  );
};

export default Home;